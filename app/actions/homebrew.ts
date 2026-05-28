'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { homebrewSpell, homebrewItem, homebrewRace, homebrewClass, campaignMember } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autorizado')
  return session.user.id
}

async function assertMaster(campaignId: string, userId: string) {
  const result = await db.select().from(campaignMember)
    .where(and(
      eq(campaignMember.campaignId, campaignId),
      eq(campaignMember.userId, userId),
      eq(campaignMember.role, 'master'),
    )).limit(1)
  if (!result.length) throw new Error('Apenas o mestre pode gerenciar homebrew')
}

async function assertMember(campaignId: string, userId: string) {
  const result = await db.select().from(campaignMember)
    .where(and(
      eq(campaignMember.campaignId, campaignId),
      eq(campaignMember.userId, userId),
    )).limit(1)
  if (!result.length) throw new Error('Acesso negado')
}

// ── Magias ────────────────────────────────────────────────────────────────────

export async function getHomebrewSpells(campaignId: string) {
  const userId = await getUserId()
  await assertMember(campaignId, userId)
  return db.select().from(homebrewSpell).where(eq(homebrewSpell.campaignId, campaignId))
}

export async function createHomebrewSpell(campaignId: string, data: {
  name: string; level: number; school: string; castingTime: string
  range: string; components: string; duration: string; description: string
  higherLevels?: string; classes?: string[]; ritual?: boolean; concentration?: boolean
}) {
  const userId = await getUserId()
  await assertMaster(campaignId, userId)
  await db.insert(homebrewSpell).values({ id: nanoid(), campaignId, createdBy: userId, ...data })
  revalidatePath(`/dashboard/campaigns/${campaignId}/homebrew`)
}

export async function updateHomebrewSpell(id: string, campaignId: string, data: {
  name?: string; level?: number; school?: string; castingTime?: string
  range?: string; components?: string; duration?: string; description?: string
  higherLevels?: string; classes?: string[]; ritual?: boolean; concentration?: boolean
}) {
  const userId = await getUserId()
  await assertMaster(campaignId, userId)
  await db.update(homebrewSpell)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(homebrewSpell.id, id), eq(homebrewSpell.campaignId, campaignId)))
  revalidatePath(`/dashboard/campaigns/${campaignId}/homebrew`)
}

export async function deleteHomebrewSpell(id: string, campaignId: string) {
  const userId = await getUserId()
  await assertMaster(campaignId, userId)
  await db.delete(homebrewSpell).where(and(eq(homebrewSpell.id, id), eq(homebrewSpell.campaignId, campaignId)))
  revalidatePath(`/dashboard/campaigns/${campaignId}/homebrew`)
}

// ── Itens ─────────────────────────────────────────────────────────────────────

export async function getHomebrewItems(campaignId: string) {
  const userId = await getUserId()
  await assertMember(campaignId, userId)
  return db.select().from(homebrewItem).where(eq(homebrewItem.campaignId, campaignId))
}

export async function createHomebrewItem(campaignId: string, data: {
  name: string; type: string; description: string
  weight?: number; value?: string; rarity?: 'Comum'|'Incomum'|'Raro'|'Muito Raro'|'Lendário'|'Artefato'
  requiresAttunement?: boolean; properties?: string[]
}) {
  const userId = await getUserId()
  await assertMaster(campaignId, userId)
  await db.insert(homebrewItem).values({ id: nanoid(), campaignId, createdBy: userId, ...data })
  revalidatePath(`/dashboard/campaigns/${campaignId}/homebrew`)
}

export async function updateHomebrewItem(id: string, campaignId: string, data: {
  name?: string; type?: string; description?: string
  weight?: number; value?: string; rarity?: 'Comum'|'Incomum'|'Raro'|'Muito Raro'|'Lendário'|'Artefato'
  requiresAttunement?: boolean; properties?: string[]
}) {
  const userId = await getUserId()
  await assertMaster(campaignId, userId)
  await db.update(homebrewItem)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(homebrewItem.id, id), eq(homebrewItem.campaignId, campaignId)))
  revalidatePath(`/dashboard/campaigns/${campaignId}/homebrew`)
}

export async function deleteHomebrewItem(id: string, campaignId: string) {
  const userId = await getUserId()
  await assertMaster(campaignId, userId)
  await db.delete(homebrewItem).where(and(eq(homebrewItem.id, id), eq(homebrewItem.campaignId, campaignId)))
  revalidatePath(`/dashboard/campaigns/${campaignId}/homebrew`)
}

// ── Raças ─────────────────────────────────────────────────────────────────────

export async function getHomebrewRaces(campaignId: string) {
  const userId = await getUserId()
  await assertMember(campaignId, userId)
  return db.select().from(homebrewRace).where(eq(homebrewRace.campaignId, campaignId))
}

export async function createHomebrewRace(campaignId: string, data: {
  name: string; speed?: number; size?: string; description?: string
  traits?: {name:string;desc:string}[]; languages?: string[]
}) {
  const userId = await getUserId()
  await assertMaster(campaignId, userId)
  await db.insert(homebrewRace).values({ id: nanoid(), campaignId, createdBy: userId, ...data })
  revalidatePath(`/dashboard/campaigns/${campaignId}/homebrew`)
}

export async function deleteHomebrewRace(id: string, campaignId: string) {
  const userId = await getUserId()
  await assertMaster(campaignId, userId)
  await db.delete(homebrewRace).where(and(eq(homebrewRace.id, id), eq(homebrewRace.campaignId, campaignId)))
  revalidatePath(`/dashboard/campaigns/${campaignId}/homebrew`)
}

// ── Classes ───────────────────────────────────────────────────────────────────

export async function getHomebrewClasses(campaignId: string) {
  const userId = await getUserId()
  await assertMember(campaignId, userId)
  return db.select().from(homebrewClass).where(eq(homebrewClass.campaignId, campaignId))
}

export async function createHomebrewClass(campaignId: string, data: {
  name: string; hitDice?: string; primaryAbility?: string; description?: string
  savingThrows?: string[]; spellcaster?: boolean; features?: {level:number;name:string;desc:string}[]
}) {
  const userId = await getUserId()
  await assertMaster(campaignId, userId)
  await db.insert(homebrewClass).values({ id: nanoid(), campaignId, createdBy: userId, ...data })
  revalidatePath(`/dashboard/campaigns/${campaignId}/homebrew`)
}

export async function deleteHomebrewClass(id: string, campaignId: string) {
  const userId = await getUserId()
  await assertMaster(campaignId, userId)
  await db.delete(homebrewClass).where(and(eq(homebrewClass.id, id), eq(homebrewClass.campaignId, campaignId)))
  revalidatePath(`/dashboard/campaigns/${campaignId}/homebrew`)
}
