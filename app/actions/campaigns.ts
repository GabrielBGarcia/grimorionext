'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { campaign, campaignMember, user, characters } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autorizado')
  return session
}

// ✅ nanoid é criptograficamente seguro (era Math.random antes)
function generateInviteCode() {
  return nanoid(6).toUpperCase()
}

export async function createCampaign(data: { name: string; description?: string }) {
  const session = await getSession()
  const userId = session.user.id
  const id = nanoid()
  const inviteCode = generateInviteCode()

  await db.insert(campaign).values({
    id,
    masterId: userId,
    name: data.name,
    description: data.description,
    inviteCode,
  })

  // Mestre também entra como membro
  await db.insert(campaignMember).values({
    id: nanoid(), campaignId: id, userId, role: 'master',
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/campaigns')
  return { id, inviteCode }
}

export async function getMyCampaigns() {
  const session = await getSession()
  const userId = session.user.id

  const members = await db
    .select()
    .from(campaignMember)
    .where(eq(campaignMember.userId, userId))

  const campaignIds = members.map(m => m.campaignId)
  if (!campaignIds.length) return []

  // ✅ Uma única query com IN em vez de N queries paralelas
  const campaigns = await db
    .select()
    .from(campaign)
    .where(inArray(campaign.id, campaignIds))

  return campaigns.map(camp => {
    const member = members.find(m => m.campaignId === camp.id)
    return { ...camp, role: member?.role }
  })
}

export async function getCampaign(id: string) {
  const session = await getSession()
  const userId = session.user.id

  const member = await db
    .select()
    .from(campaignMember)
    .where(and(eq(campaignMember.campaignId, id), eq(campaignMember.userId, userId)))
    .limit(1)

  if (!member.length) throw new Error('Acesso negado')

  const result = await db
    .select()
    .from(campaign)
    .where(eq(campaign.id, id))
    .limit(1)

  return result[0] ?? null
}

export async function joinCampaign(inviteCode: string) {
  const session = await getSession()
  const userId = session.user.id

  const result = await db
    .select()
    .from(campaign)
    .where(and(eq(campaign.inviteCode, inviteCode.toUpperCase()), eq(campaign.isActive, true)))
    .limit(1)

  if (!result.length) throw new Error('Código inválido ou campanha inativa')

  const camp = result[0]

  const existing = await db
    .select()
    .from(campaignMember)
    .where(and(eq(campaignMember.campaignId, camp.id), eq(campaignMember.userId, userId)))
    .limit(1)

  if (existing.length) throw new Error('Você já faz parte dessa campanha')

  await db.insert(campaignMember).values({
    id: nanoid(), campaignId: camp.id, userId, role: 'player',
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/campaigns')
  return { campaignId: camp.id, name: camp.name }
}

export async function getCampaignMembers(campaignId: string) {
  const session = await getSession()
  const userId = session.user.id

  const member = await db
    .select()
    .from(campaignMember)
    .where(and(eq(campaignMember.campaignId, campaignId), eq(campaignMember.userId, userId)))
    .limit(1)

  if (!member.length) throw new Error('Acesso negado')

  return db
    .select({
      id: campaignMember.id,
      role: campaignMember.role,
      joinedAt: campaignMember.joinedAt,
      odUserId: user.id,
      userName: user.name,
      userEmail: user.email,
    })
    .from(campaignMember)
    .innerJoin(user, eq(campaignMember.userId, user.id))
    .where(eq(campaignMember.campaignId, campaignId))
}

export async function getCampaignCharacters(campaignId: string) {
  const session = await getSession()
  const userId = session.user.id

  const member = await db
    .select()
    .from(campaignMember)
    .where(and(eq(campaignMember.campaignId, campaignId), eq(campaignMember.userId, userId)))
    .limit(1)

  if (!member.length) throw new Error('Acesso negado')

  return db
    .select({
      id: characters.id,
      name: characters.name,
      race: characters.race,
      characterClass: characters.class,
      level: characters.level,
      hitPointsCurrent: characters.hitPointsCurrent,
      hitPointsMax: characters.hitPointsMax,
      armorClass: characters.armorClass,
      portrait: characters.portrait,
      userId: characters.userId,
      userName: user.name,
    })
    .from(characters)
    .innerJoin(user, eq(characters.userId, user.id))
    .where(eq(characters.campaignId, campaignId))
}

export async function isMaster(campaignId: string) {
  const session = await getSession()
  const userId = session.user.id

  const result = await db
    .select()
    .from(campaignMember)
    .where(and(
      eq(campaignMember.campaignId, campaignId),
      eq(campaignMember.userId, userId),
      eq(campaignMember.role, 'master'),
    ))
    .limit(1)

  return result.length > 0
}

export async function leaveCampaign(campaignId: string) {
  const session = await getSession()
  const userId = session.user.id

  const member = await db
    .select()
    .from(campaignMember)
    .where(and(eq(campaignMember.campaignId, campaignId), eq(campaignMember.userId, userId)))
    .limit(1)

  if (!member.length) throw new Error('Você não faz parte dessa campanha')
  if (member[0].role === 'master') throw new Error('O mestre não pode sair da campanha')

  await db
    .delete(campaignMember)
    .where(and(eq(campaignMember.campaignId, campaignId), eq(campaignMember.userId, userId)))

  await db
    .update(characters)
    .set({ campaignId: null })
    .where(and(eq(characters.campaignId, campaignId), eq(characters.userId, userId)))

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/campaigns')
}

export async function deleteCampaign(campaignId: string) {
  const session = await getSession()
  const userId = session.user.id

  const isMasterResult = await isMaster(campaignId)
  if (!isMasterResult) throw new Error('Apenas o mestre pode deletar a campanha')

  await db
    .update(characters)
    .set({ campaignId: null })
    .where(eq(characters.campaignId, campaignId))

  await db.delete(campaign).where(eq(campaign.id, campaignId))

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/campaigns')
}