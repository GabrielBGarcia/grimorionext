'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { character } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'
import type { NewCharacter, Character } from '@/lib/db/schema'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autorizado')
  return session.user.id
}

export async function getCharacters() {
  const userId = await getUserId()
  return db
    .select()
    .from(character)
    .where(eq(character.userId, userId))
    .orderBy(desc(character.updatedAt))
}

export async function getCharacter(id: string) {
  const userId = await getUserId()
  const results = await db
    .select()
    .from(character)
    .where(and(eq(character.id, id), eq(character.userId, userId)))
    .limit(1)
  return results[0] ?? null
}

// Calcula HP baseado na classe
function getHitDiceByClass(characterClass: string): string {
  const hitDice: Record<string, string> = {
    'Bárbaro': 'd12',
    'Guerreiro': 'd10',
    'Paladino': 'd10',
    'Ranger': 'd10',
    'Bardo': 'd8',
    'Clérigo': 'd8',
    'Druida': 'd8',
    'Monge': 'd8',
    'Ladino': 'd8',
    'Bruxo': 'd8',
    'Feiticeiro': 'd6',
    'Mago': 'd6',
  }
  return hitDice[characterClass] || 'd8'
}

function getHitDiceMax(hitDice: string): number {
  const dice: Record<string, number> = { 'd6': 6, 'd8': 8, 'd10': 10, 'd12': 12 }
  return dice[hitDice] || 8
}

export async function createCharacter(data: {
  name: string
  race: string
  characterClass: string
  level?: number
  background?: string
  campaignId?: string
  attributes?: { str: number; dex: number; con: number; int: number; wis: number; cha: number }
}) {
  const userId = await getUserId()
  const id = nanoid()
  const level = data.level ?? 1
  const hitDice = getHitDiceByClass(data.characterClass)
  const hitDiceMax = getHitDiceMax(hitDice)
  const attrs = data.attributes ?? { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
  const conMod = Math.floor((attrs.con - 10) / 2)
  const baseHP = hitDiceMax + conMod
  
  const newCharacter: NewCharacter = {
    id,
    userId,
    campaignId: data.campaignId ?? null,
    name: data.name,
    race: data.race,
    characterClass: data.characterClass,
    level,
    background: data.background,
    hitPointsMax: baseHP,
    hitPointsCurrent: baseHP,
    hitDiceType: hitDice,
    attributes: attrs,
    proficiencyBonus: Math.floor((level - 1) / 4) + 2,
  }
  
  await db.insert(character).values(newCharacter)
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/characters')
  return { id }
}

export async function updateCharacter(id: string, data: Partial<NewCharacter>) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
  revalidatePath('/dashboard')
}

export async function deleteCharacter(id: string) {
  const userId = await getUserId()
  
  await db
    .delete(character)
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/characters')
}

export async function updateCharacterSpells(
  id: string,
  knownSpells: string[],
  preparedSpells: string[]
) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      knownSpells, 
      preparedSpells,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateSpellSlots(
  id: string,
  spellSlotsUsed: Record<string, number>
) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      spellSlotsUsed,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateCharacterHP(
  id: string,
  hitPointsCurrent: number,
  hitPointsTemp?: number
) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      hitPointsCurrent,
      ...(hitPointsTemp !== undefined ? { hitPointsTemp } : {}),
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateDeathSaves(
  id: string,
  deathSaves: { success: boolean[]; failure: boolean[] }
) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      deathSaves,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateConditions(
  id: string,
  conditions: string[]
) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      conditions,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function toggleInspiration(id: string, inspiration: boolean) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      inspiration,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateInventory(
  id: string,
  inventory: Array<{ id: string; name: string; quantity: number; weight: number; description?: string }>
) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      inventory,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateCurrency(
  id: string,
  currency: { pp: number; gp: number; ep: number; sp: number; cp: number }
) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      currency,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateAttributes(
  id: string,
  attributes: { str: number; dex: number; con: number; int: number; wis: number; cha: number }
) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      attributes,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateSavingThrowProfs(id: string, savingThrowProfs: string[]) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      savingThrowProfs,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateSkillProfs(id: string, skillProfs: string[], expertSkills: string[]) {
  const userId = await getUserId()
  
  await db
    .update(character)
    .set({ 
      skillProfs,
      expertSkills,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function useHitDice(id: string) {
  const userId = await getUserId()
  const char = await getCharacter(id)
  if (!char) throw new Error('Personagem não encontrado')
  
  const hitDiceUsed = (char.hitDiceUsed ?? 0) + 1
  if (hitDiceUsed > char.level) throw new Error('Sem dados de vida disponíveis')
  
  await db
    .update(character)
    .set({ 
      hitDiceUsed,
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function longRest(id: string) {
  const userId = await getUserId()
  const char = await getCharacter(id)
  if (!char) throw new Error('Personagem não encontrado')
  
  // Recupera HP total e metade dos dados de vida
  const hitDiceRecovered = Math.max(1, Math.floor(char.level / 2))
  const newHitDiceUsed = Math.max(0, (char.hitDiceUsed ?? 0) - hitDiceRecovered)
  
  await db
    .update(character)
    .set({ 
      hitPointsCurrent: char.hitPointsMax,
      hitPointsTemp: 0,
      hitDiceUsed: newHitDiceUsed,
      spellSlotsUsed: {},
      deathSaves: { success: [false, false, false], failure: [false, false, false] },
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}

export async function shortRest(id: string) {
  const userId = await getUserId()
  
  // Short rest não recupera slots automaticamente, 
  // apenas permite usar dados de vida
  await db
    .update(character)
    .set({ 
      updatedAt: new Date() 
    })
    .where(and(eq(character.id, id), eq(character.userId, userId)))
  
  revalidatePath(`/dashboard/characters/${id}`)
}
