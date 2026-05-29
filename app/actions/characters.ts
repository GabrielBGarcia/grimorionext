'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { characters, inventoryItems } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'
import type { NewCharacter } from '@/lib/db/schema'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autorizado')
  return session.user.id
}

export async function getCharacters() {
  const userId = await getUserId()
  return db
    .select()
    .from(characters)
    .where(eq(characters.userId, userId))
    .orderBy(desc(characters.updatedAt))
}

export async function getCharacter(id: string) {
  const userId = await getUserId()
  const results = await db
    .select()
    .from(characters)
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))
    .limit(1)
  return results[0] ?? null
}

// Calcula HP baseado na classe
function getHitDiceByClass(charactersClass: string): string {
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
  return hitDice[charactersClass] || 'd8'
}

function getHitDiceMax(hitDice: string): number {
  const dice: Record<string, number> = { 'd6': 6, 'd8': 8, 'd10': 10, 'd12': 12 }
  return dice[hitDice] || 8
}

export async function createCharacter(data: {
  name: string
  race: string
  charactersClass: string
  level?: number
  background?: string
  campaignId?: string
  attributes?: { str: number; dex: number; con: number; int: number; wis: number; cha: number }
}) {
  const userId = await getUserId()
  const id = nanoid()
  const level = data.level ?? 1
  const hitDice = getHitDiceByClass(data.charactersClass)
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
    class: data.charactersClass,
    level,
    background: data.background,
    hitPointsMax: baseHP,
    hitPointsCurrent: baseHP,
    hitDiceType: hitDice,
    attributes: attrs,
    proficiencyBonus: Math.floor((level - 1) / 4) + 2,
  }

  await db.insert(characters).values(newCharacter)
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/characters')
  return { id }
}

export async function updateCharacter(id: string, data: Partial<NewCharacter>) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
  revalidatePath('/dashboard')
}

export async function deleteCharacter(id: string) {
  const userId = await getUserId()

  await db
    .delete(characters)
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/characters')
}

export async function updateCharacterHP(
  id: string,
  hitPointsCurrent: number,
  hitPointsTemp?: number
) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({
      hitPointsCurrent,
      ...(hitPointsTemp !== undefined ? { hitPointsTemp } : {}),
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateAttributes(
  id: string,
  attributes: { str: number; dex: number; con: number; int: number; wis: number; cha: number }
) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({
      attributes,
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateSavingThrowProfs(id: string, savingThrowProfs: string[]) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({
      savingThrowProfs,
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateSkillProfs(id: string, skillProfs: string[], expertSkills: string[]) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({
      skillProfs,
      expertSkills,
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateConditions(id: string, conditions: string[]) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({
      conditions,
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function toggleInspiration(id: string, inspiration: boolean) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({
      inspiration,
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function longRest(id: string) {
  const userId = await getUserId()
  const char = await getCharacter(id)
  if (!char) throw new Error('Personagem não encontrado')

  const hitDiceRecovered = Math.max(1, Math.floor(char.level / 2))
  const newHitDiceUsed = Math.max(0, (char.hitDiceUsed ?? 0) - hitDiceRecovered)

  await db
    .update(characters)
    .set({
      hitPointsCurrent: char.hitPointsMax,
      hitPointsTemp: 0,
      hitDiceUsed: newHitDiceUsed,
      spellSlotsUsed: {},
      deathSaves: { success: [false, false, false], failure: [false, false, false] },
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function shortRest(id: string) {
  const userId = await getUserId()

  // Short rest não recupera slots automaticamente,
  // apenas permite usar dados de vida (veja useHitDice)
  await db
    .update(characters)
    .set({ updatedAt: new Date() })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function useHitDice(id: string) {
  const userId = await getUserId()
  const char = await getCharacter(id)
  if (!char) throw new Error('Personagem não encontrado')

  const hitDiceUsed = (char.hitDiceUsed ?? 0) + 1
  if (hitDiceUsed > char.level) throw new Error('Sem dados de vida disponíveis')

  await db
    .update(characters)
    .set({
      hitDiceUsed,
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateDeathSaves(
  id: string,
  deathSaves: { success: boolean[]; failure: boolean[] }
) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({
      deathSaves,
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateCharacterSpells(
  id: string,
  knownSpells: string[],
  preparedSpells: string[]
) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({
      knownSpells,
      preparedSpells,
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

export async function updateSpellSlots(
  id: string,
  spellSlotsUsed: Record<string, number>
) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({
      spellSlotsUsed,
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}

// ==========================================
// INVENTÁRIO — usa a tabela inventory_item
// ==========================================

export async function addInventoryItem(
  characterId: string,
  item: {
    name: string
    description?: string
    quantity?: number
    weight?: number
    value?: string
    category?: string
  }
) {
  await getUserId() // garante autenticação

  await db.insert(inventoryItems).values({
    id: nanoid(),
    characterId,
    name: item.name,
    description: item.description ?? null,
    quantity: item.quantity ?? 1,
    weight: item.weight ?? 0,
    value: item.value ?? null,
    category: item.category ?? 'misc',
  })

  revalidatePath(`/dashboard/characters/${characterId}`)
}

export async function updateInventoryItem(
  itemId: string,
  characterId: string,
  data: Partial<{
    name: string
    description: string
    quantity: number
    weight: number
    value: string
    category: string
    isEquipped: boolean
    isAttuned: boolean
  }>
) {
  await getUserId()

  await db
    .update(inventoryItems)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.characterId, characterId)))

  revalidatePath(`/dashboard/characters/${characterId}`)
}

export async function deleteInventoryItem(itemId: string, characterId: string) {
  await getUserId()

  await db
    .delete(inventoryItems)
    .where(and(eq(inventoryItems.id, itemId), eq(inventoryItems.characterId, characterId)))

  revalidatePath(`/dashboard/characters/${characterId}`)
}

// ==========================================
// MOEDAS — colunas diretas na tabela character
// ==========================================

export async function updateCurrency(
  id: string,
  currency: { pp: number; gp: number; ep: number; sp: number; cp: number }
) {
  const userId = await getUserId()

  await db
    .update(characters)
    .set({
      pp: currency.pp,
      gp: currency.gp,
      ep: currency.ep,
      sp: currency.sp,
      cp: currency.cp,
      updatedAt: new Date()
    })
    .where(and(eq(characters.id, id), eq(characters.userId, userId)))

  revalidatePath(`/dashboard/characters/${id}`)
}