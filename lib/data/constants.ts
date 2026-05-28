// D&D 5E Character Constants (Portuguese)

export const RACES = [
  'Humano',
  'Elfo',
  'Anão',
  'Halfling',
  'Draconato',
  'Gnomo',
  'Meio-Elfo',
  'Meio-Orc',
  'Tiefling',
] as const

export const CLASSES = [
  'Bárbaro',
  'Bardo',
  'Bruxo',
  'Clérigo',
  'Druida',
  'Feiticeiro',
  'Guerreiro',
  'Ladino',
  'Mago',
  'Monge',
  'Paladino',
  'Patrulheiro',
] as const

export const ALIGNMENTS = [
  'Leal e Bom',
  'Neutro e Bom',
  'Caótico e Bom',
  'Leal e Neutro',
  'Neutro',
  'Caótico e Neutro',
  'Leal e Mau',
  'Neutro e Mau',
  'Caótico e Mau',
] as const

export const BACKGROUNDS = [
  'Acólito',
  'Artesão de Guilda',
  'Artista',
  'Charlatão',
  'Criminoso',
  'Eremita',
  'Forasteiro',
  'Herói do Povo',
  'Marinheiro',
  'Nobre',
  'Órfão',
  'Sábio',
  'Soldado',
] as const

export const ATTRIBUTES = [
  { id: 'str', name: 'Força', abbr: 'FOR' },
  { id: 'dex', name: 'Destreza', abbr: 'DES' },
  { id: 'con', name: 'Constituição', abbr: 'CON' },
  { id: 'int', name: 'Inteligência', abbr: 'INT' },
  { id: 'wis', name: 'Sabedoria', abbr: 'SAB' },
  { id: 'cha', name: 'Carisma', abbr: 'CAR' },
] as const

export const SKILLS = [
  { id: 'acrobatics', name: 'Acrobacia', attribute: 'dex' },
  { id: 'animalHandling', name: 'Adestrar Animais', attribute: 'wis' },
  { id: 'arcana', name: 'Arcanismo', attribute: 'int' },
  { id: 'athletics', name: 'Atletismo', attribute: 'str' },
  { id: 'deception', name: 'Enganação', attribute: 'cha' },
  { id: 'history', name: 'História', attribute: 'int' },
  { id: 'insight', name: 'Intuição', attribute: 'wis' },
  { id: 'intimidation', name: 'Intimidação', attribute: 'cha' },
  { id: 'investigation', name: 'Investigação', attribute: 'int' },
  { id: 'medicine', name: 'Medicina', attribute: 'wis' },
  { id: 'nature', name: 'Natureza', attribute: 'int' },
  { id: 'perception', name: 'Percepção', attribute: 'wis' },
  { id: 'performance', name: 'Atuação', attribute: 'cha' },
  { id: 'persuasion', name: 'Persuasão', attribute: 'cha' },
  { id: 'religion', name: 'Religião', attribute: 'int' },
  { id: 'sleightOfHand', name: 'Prestidigitação', attribute: 'dex' },
  { id: 'stealth', name: 'Furtividade', attribute: 'dex' },
  { id: 'survival', name: 'Sobrevivência', attribute: 'wis' },
] as const

export const SPELLCASTING_CLASSES = [
  'Bardo',
  'Bruxo',
  'Clérigo',
  'Druida',
  'Feiticeiro',
  'Mago',
  'Paladino',
  'Patrulheiro',
] as const

export const SPELLCASTING_ABILITY: Record<string, string> = {
  'Bardo': 'cha',
  'Bruxo': 'cha',
  'Clérigo': 'wis',
  'Druida': 'wis',
  'Feiticeiro': 'cha',
  'Mago': 'int',
  'Paladino': 'cha',
  'Patrulheiro': 'wis',
}

// Experience points needed per level
export const XP_THRESHOLDS = [
  0,      // Level 1
  300,    // Level 2
  900,    // Level 3
  2700,   // Level 4
  6500,   // Level 5
  14000,  // Level 6
  23000,  // Level 7
  34000,  // Level 8
  48000,  // Level 9
  64000,  // Level 10
  85000,  // Level 11
  100000, // Level 12
  120000, // Level 13
  140000, // Level 14
  165000, // Level 15
  195000, // Level 16
  225000, // Level 17
  265000, // Level 18
  305000, // Level 19
  355000, // Level 20
]

export const PROFICIENCY_BONUS = [
  2, // Level 1-4
  2,
  2,
  2,
  3, // Level 5-8
  3,
  3,
  3,
  4, // Level 9-12
  4,
  4,
  4,
  5, // Level 13-16
  5,
  5,
  5,
  6, // Level 17-20
  6,
  6,
  6,
]

export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export function getProficiencyBonus(level: number): number {
  return PROFICIENCY_BONUS[Math.min(level - 1, 19)]
}

export function getLevelFromXP(xp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}
