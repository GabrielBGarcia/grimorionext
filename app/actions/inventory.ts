'use server'

import { db } from '@/lib/db'
import { inventoryItems, characters } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Não autenticado')
  return session.user.id
}

export async function getInventoryItems(characterId: string) {
  const userId = await getUserId()
  
  // Verify character belongs to user
  const character = await db.query.characters.findFirst({
    where: and(eq(characters.id, characterId), eq(characters.userId, userId)),
  })
  
  if (!character) throw new Error('Personagem não encontrado')
  
  return db.query.inventoryItems.findMany({
    where: eq(inventoryItems.characterId, characterId),
    orderBy: (items, { asc }) => [asc(items.name)],
  })
}

export async function addInventoryItem(data: {
  characterId: string
  name: string
  description?: string
  quantity?: number
  weight?: number
  value?: string
  category?: string
  isEquipped?: boolean
  isAttuned?: boolean
}) {
  const userId = await getUserId()
  
  // Verify character belongs to user
  const character = await db.query.characters.findFirst({
    where: and(eq(characters.id, data.characterId), eq(characters.userId, userId)),
  })
  
  if (!character) throw new Error('Personagem não encontrado')
  
  const id = nanoid()
  
  await db.insert(inventoryItems).values({
    id,
    characterId: data.characterId,
    name: data.name,
    description: data.description,
    quantity: data.quantity ?? 1,
    weight: data.weight,
    value: data.value,
    category: data.category ?? 'misc',
    isEquipped: data.isEquipped ?? false,
    isAttuned: data.isAttuned ?? false,
  })
  
  revalidatePath(`/dashboard/characters/${data.characterId}`)
  revalidatePath('/dashboard/inventory')
  return { id }
}

export async function updateInventoryItem(
  itemId: string,
  data: {
    name?: string
    description?: string
    quantity?: number
    weight?: number
    value?: string
    category?: string
    isEquipped?: boolean
    isAttuned?: boolean
  }
) {
  const userId = await getUserId()
  
  // Get item and verify ownership
  const item = await db.query.inventoryItems.findFirst({
    where: eq(inventoryItems.id, itemId),
    with: { character: true },
  })
  
  if (!item || item.character.userId !== userId) {
    throw new Error('Item não encontrado')
  }
  
  await db.update(inventoryItems).set(data).where(eq(inventoryItems.id, itemId))
  
  revalidatePath(`/dashboard/characters/${item.characterId}`)
  revalidatePath('/dashboard/inventory')
  return { success: true }
}

export async function deleteInventoryItem(itemId: string) {
  const userId = await getUserId()
  
  // Get item and verify ownership
  const item = await db.query.inventoryItems.findFirst({
    where: eq(inventoryItems.id, itemId),
    with: { character: true },
  })
  
  if (!item || item.character.userId !== userId) {
    throw new Error('Item não encontrado')
  }
  
  await db.delete(inventoryItems).where(eq(inventoryItems.id, itemId))
  
  revalidatePath(`/dashboard/characters/${item.characterId}`)
  revalidatePath('/dashboard/inventory')
  return { success: true }
}

export async function toggleEquipped(itemId: string) {
  const userId = await getUserId()
  
  const item = await db.query.inventoryItems.findFirst({
    where: eq(inventoryItems.id, itemId),
    with: { character: true },
  })
  
  if (!item || item.character.userId !== userId) {
    throw new Error('Item não encontrado')
  }
  
  await db
    .update(inventoryItems)
    .set({ isEquipped: !item.isEquipped })
    .where(eq(inventoryItems.id, itemId))
  
  revalidatePath(`/dashboard/characters/${item.characterId}`)
  revalidatePath('/dashboard/inventory')
  return { success: true }
}

export async function updateCurrency(
  characterId: string,
  currency: { cp?: number; sp?: number; ep?: number; gp?: number; pp?: number }
) {
  const userId = await getUserId()
  
  const character = await db.query.characters.findFirst({
    where: and(eq(characters.id, characterId), eq(characters.userId, userId)),
  })
  
  if (!character) throw new Error('Personagem não encontrado')
  
  await db.update(characters).set(currency).where(eq(characters.id, characterId))
  
  revalidatePath(`/dashboard/characters/${characterId}`)
  revalidatePath('/dashboard/inventory')
  return { success: true }
}
