import {
  pgTable, text, timestamp, boolean,
  integer, real, jsonb, pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const userRoleEnum   = pgEnum('user_role',   ['player', 'master'])
export const memberRoleEnum = pgEnum('member_role', ['master', 'player'])
export const rarityEnum     = pgEnum('rarity',      ['Comum','Incomum','Raro','Muito Raro','Lendário','Artefato'])

// ── Better Auth ───────────────────────────────────────────────────────────────

export const user = pgTable('user', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  email:         text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image:         text('image'),
  role:          userRoleEnum('role').notNull().default('player'),
  createdAt:     timestamp('createdAt').notNull().defaultNow(),
  updatedAt:     timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id:        text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token:     text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId:    text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id:                    text('id').primaryKey(),
  accountId:             text('accountId').notNull(),
  providerId:            text('providerId').notNull(),
  userId:                text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken:           text('accessToken'),
  refreshToken:          text('refreshToken'),
  idToken:               text('idToken'),
  accessTokenExpiresAt:  timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope:                 text('scope'),
  password:              text('password'),
  createdAt:             timestamp('createdAt').notNull().defaultNow(),
  updatedAt:             timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id:         text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value:      text('value').notNull(),
  expiresAt:  timestamp('expiresAt').notNull(),
  createdAt:  timestamp('createdAt').defaultNow(),
  updatedAt:  timestamp('updatedAt').defaultNow(),
})

// ── Campanha ──────────────────────────────────────────────────────────────────

export const campaign = pgTable('campaign', {
  id:          text('id').primaryKey(),
  masterId:    text('master_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name:        text('name').notNull(),
  description: text('description'),
  inviteCode:  text('invite_code').notNull().unique(),
  isActive:    boolean('is_active').notNull().default(true),
  createdAt:   timestamp('createdAt').notNull().defaultNow(),
  updatedAt:   timestamp('updatedAt').notNull().defaultNow(),
})

export const campaignMember = pgTable('campaign_member', {
  id:         text('id').primaryKey(),
  campaignId: text('campaign_id').notNull().references(() => campaign.id, { onDelete: 'cascade' }),
  userId:     text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role:       memberRoleEnum('role').notNull().default('player'),
  joinedAt:   timestamp('joined_at').notNull().defaultNow(),
})

// ── Personagem ────────────────────────────────────────────────────────────────

export const characters = pgTable('character', {
  id:             text('id').primaryKey(),
  userId:         text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  campaignId:     text('campaign_id').references(() => campaign.id, { onDelete: 'set null' }),
  name:           text('name').notNull(),
  race:           text('race').notNull().default('Humano'),
  class:          text('class').notNull().default('Guerreiro'),
  subclass:       text('subclass'),
  background:     text('background'),
  alignment:      text('alignment'),
  age:            text('age'),
  level:          integer('level').notNull().default(1),
  xp:             integer('xp').default(0),
  portrait:       text('portrait'),
  attributes: jsonb('attributes').notNull().default({
    str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
  }),
  proficiencyBonus: integer('proficiency_bonus').default(2),
  savingThrowProfs: jsonb('saving_throw_profs').default([]),
  skillProfs:       jsonb('skill_profs').default([]),
  expertSkills:     jsonb('expert_skills').default([]),
  proficiencies:    jsonb('proficiencies').default([]),
  languages:        jsonb('languages').default([]),
  armorClass:       integer('armor_class').default(10),
  initiative:       integer('initiative').default(0),
  speed:            integer('speed').default(30),
  hitPointsMax:     integer('hp_max').notNull().default(10),
  hitPointsCurrent: integer('hp_current').notNull().default(10),
  hitPointsTemp:    integer('hp_temp').default(0),
  hitDiceType:      text('hit_dice_type').default('d8'),
  hitDiceUsed:      integer('hit_dice_used').default(0),
  deathSaves: jsonb('death_saves').default({
    success: [false, false, false],
    failure: [false, false, false],
  }),
  conditions:          jsonb('conditions').default([]),
  inspiration:         boolean('inspiration').default(false),
  spellcastingAbility: text('spellcasting_ability'),
  spellSlots:          jsonb('spell_slots').default({}),
  spellSlotsUsed:      jsonb('spell_slots_used').default({}),
  knownSpells:         jsonb('known_spells').default([]),
  preparedSpells:      jsonb('prepared_spells').default([]),
  feats:               jsonb('feats').default([]),
  resistances:         jsonb('resistances').default([]),
  featuresAndTraits:   jsonb('features_and_traits').default([]),
  personality:         text('personality'),
  ideals:              text('ideals'),
  bonds:               text('bonds'),
  flaws:               text('flaws'),
  backstory:           text('backstory'),
  notes:               text('notes'),
  equipment:           text('equipment'),
  // Currency
  pp:                  integer('pp').default(0),
  gp:                  integer('gp').default(0),
  ep:                  integer('ep').default(0),
  sp:                  integer('sp').default(0),
  cp:                  integer('cp').default(0),
  createdAt:           timestamp('createdAt').notNull().defaultNow(),
  updatedAt:           timestamp('updatedAt').notNull().defaultNow(),
})

// ── Inventário ────────────────────────────────────────────────────────────────

export const inventoryItems = pgTable('inventory_item', {
  id:          text('id').primaryKey(),
  characterId: text('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  name:        text('name').notNull(),
  description: text('description'),
  quantity:    integer('quantity').default(1),
  weight:      real('weight').default(0),
  value:       text('value'),
  category:    text('category').default('misc'),
  isEquipped:  boolean('is_equipped').default(false),
  isAttuned:   boolean('is_attuned').default(false),
  createdAt:   timestamp('createdAt').notNull().defaultNow(),
  updatedAt:   timestamp('updatedAt').notNull().defaultNow(),
})

// ── Homebrew ──────────────────────────────────────────────────────────────────

export const homebrewSpell = pgTable('homebrew_spell', {
  id:            text('id').primaryKey(),
  campaignId:    text('campaign_id').notNull().references(() => campaign.id, { onDelete: 'cascade' }),
  createdBy:     text('created_by').notNull().references(() => user.id),
  name:          text('name').notNull(),
  level:         integer('level').notNull().default(0),
  school:        text('school').notNull(),
  castingTime:   text('casting_time').notNull(),
  range:         text('range').notNull(),
  components:    text('components').notNull(),
  duration:      text('duration').notNull(),
  description:   text('description').notNull(),
  higherLevels:  text('higher_levels'),
  classes:       jsonb('classes').default([]),
  ritual:        boolean('ritual').default(false),
  concentration: boolean('concentration').default(false),
  createdAt:     timestamp('createdAt').notNull().defaultNow(),
  updatedAt:     timestamp('updatedAt').notNull().defaultNow(),
})

export const homebrewItem = pgTable('homebrew_item', {
  id:                 text('id').primaryKey(),
  campaignId:         text('campaign_id').notNull().references(() => campaign.id, { onDelete: 'cascade' }),
  createdBy:          text('created_by').notNull().references(() => user.id),
  name:               text('name').notNull(),
  type:               text('type').notNull(),
  rarity:             rarityEnum('rarity').default('Comum'),
  weight:             real('weight').default(0),
  value:              text('value'),
  description:        text('description').notNull(),
  properties:         jsonb('properties').default([]),
  requiresAttunement: boolean('requires_attunement').default(false),
  createdAt:          timestamp('createdAt').notNull().defaultNow(),
  updatedAt:          timestamp('updatedAt').notNull().defaultNow(),
})

export const homebrewRace = pgTable('homebrew_race', {
  id:          text('id').primaryKey(),
  campaignId:  text('campaign_id').notNull().references(() => campaign.id, { onDelete: 'cascade' }),
  createdBy:   text('created_by').notNull().references(() => user.id),
  name:        text('name').notNull(),
  speed:       integer('speed').default(30),
  size:        text('size').default('Médio'),
  traits:      jsonb('traits').default([]),
  languages:   jsonb('languages').default([]),
  description: text('description'),
  createdAt:   timestamp('createdAt').notNull().defaultNow(),
  updatedAt:   timestamp('updatedAt').notNull().defaultNow(),
})

export const homebrewClass = pgTable('homebrew_class', {
  id:             text('id').primaryKey(),
  campaignId:     text('campaign_id').notNull().references(() => campaign.id, { onDelete: 'cascade' }),
  createdBy:      text('created_by').notNull().references(() => user.id),
  name:           text('name').notNull(),
  hitDice:        text('hit_dice').default('d8'),
  primaryAbility: text('primary_ability'),
  savingThrows:   jsonb('saving_throws').default([]),
  spellcaster:    boolean('spellcaster').default(false),
  description:    text('description'),
  features:       jsonb('features').default([]),
  createdAt:      timestamp('createdAt').notNull().defaultNow(),
  updatedAt:      timestamp('updatedAt').notNull().defaultNow(),
})

// ── Relations ─────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  campaigns: many(campaign),
  memberships: many(campaignMember),
  characters: many(characters),
}))

export const campaignRelations = relations(campaign, ({ one, many }) => ({
  master: one(user, {
    fields: [campaign.masterId],
    references: [user.id],
  }),
  members: many(campaignMember),
  characters: many(characters),
  homebrewSpells: many(homebrewSpell),
  homebrewItems: many(homebrewItem),
  homebrewRaces: many(homebrewRace),
  homebrewClasses: many(homebrewClass),
}))

export const campaignMemberRelations = relations(campaignMember, ({ one }) => ({
  campaign: one(campaign, {
    fields: [campaignMember.campaignId],
    references: [campaign.id],
  }),
  user: one(user, {
    fields: [campaignMember.userId],
    references: [user.id],
  }),
}))

export const characterRelations = relations(characters, ({ one, many }) => ({
  user: one(user, {
    fields: [characters.userId],
    references: [user.id],
  }),
  campaign: one(campaign, {
    fields: [characters.campaignId],
    references: [campaign.id],
  }),
  inventory: many(inventoryItems),
}))

export const inventoryItemRelations = relations(inventoryItems, ({ one }) => ({
  character: one(characters, {
    fields: [inventoryItems.characterId],
    references: [characters.id],
  }),
}))

export const homebrewSpellRelations = relations(homebrewSpell, ({ one }) => ({
  campaign: one(campaign, {
    fields: [homebrewSpell.campaignId],
    references: [campaign.id],
  }),
  creator: one(user, {
    fields: [homebrewSpell.createdBy],
    references: [user.id],
  }),
}))

export const homebrewItemRelations = relations(homebrewItem, ({ one }) => ({
  campaign: one(campaign, {
    fields: [homebrewItem.campaignId],
    references: [campaign.id],
  }),
  creator: one(user, {
    fields: [homebrewItem.createdBy],
    references: [user.id],
  }),
}))

export const homebrewRaceRelations = relations(homebrewRace, ({ one }) => ({
  campaign: one(campaign, {
    fields: [homebrewRace.campaignId],
    references: [campaign.id],
  }),
  creator: one(user, {
    fields: [homebrewRace.createdBy],
    references: [user.id],
  }),
}))

export const homebrewClassRelations = relations(homebrewClass, ({ one }) => ({
  campaign: one(campaign, {
    fields: [homebrewClass.campaignId],
    references: [campaign.id],
  }),
  creator: one(user, {
    fields: [homebrewClass.createdBy],
    references: [user.id],
  }),
}))

// ── Types ─────────────────────────────────────────────────────────────────────

export type User           = typeof user.$inferSelect
export type Campaign       = typeof campaign.$inferSelect
export type CampaignMember = typeof campaignMember.$inferSelect
export type Character      = typeof characters.$inferSelect
export type NewCharacter   = typeof characters.$inferInsert
export type InventoryItem  = typeof inventoryItems.$inferSelect
export type HomebrewSpell  = typeof homebrewSpell.$inferSelect
export type HomebrewItem   = typeof homebrewItem.$inferSelect
export type HomebrewRace   = typeof homebrewRace.$inferSelect
export type HomebrewClass  = typeof homebrewClass.$inferSelect