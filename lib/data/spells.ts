// D&D 5E SRD Spells Data (Portuguese)
export interface Spell {
  id: string
  name: string
  level: number
  school: SpellSchool
  castingTime: string
  range: string
  components: string
  duration: string
  description: string
  higherLevels?: string
  classes: CharacterClass[]
  ritual: boolean
  concentration: boolean
  source: string
}

export type SpellSchool = 
  | 'Abjuração'
  | 'Conjuração'
  | 'Adivinhação'
  | 'Encantamento'
  | 'Evocação'
  | 'Ilusão'
  | 'Necromancia'
  | 'Transmutação'

export type CharacterClass = 
  | 'Bardo'
  | 'Bruxo'
  | 'Clérigo'
  | 'Druida'
  | 'Feiticeiro'
  | 'Guerreiro'
  | 'Ladino'
  | 'Mago'
  | 'Monge'
  | 'Paladino'
  | 'Patrulheiro'

export const SPELL_SCHOOLS: Record<SpellSchool, { color: string; icon: string }> = {
  'Abjuração': { color: 'var(--abjuration)', icon: '🛡️' },
  'Conjuração': { color: 'var(--conjuration)', icon: '✨' },
  'Adivinhação': { color: 'var(--divination)', icon: '👁️' },
  'Encantamento': { color: 'var(--enchantment)', icon: '💫' },
  'Evocação': { color: 'var(--evocation)', icon: '🔥' },
  'Ilusão': { color: 'var(--illusion)', icon: '🎭' },
  'Necromancia': { color: 'var(--necromancy)', icon: '💀' },
  'Transmutação': { color: 'var(--transmutation)', icon: '🔄' },
}

export const SPELL_LEVEL_NAMES: Record<number, string> = {
  0: 'Truque',
  1: '1º Nível',
  2: '2º Nível',
  3: '3º Nível',
  4: '4º Nível',
  5: '5º Nível',
  6: '6º Nível',
  7: '7º Nível',
  8: '8º Nível',
  9: '9º Nível',
}

// Sample SRD spells - expandable
export const SRD_SPELLS: Spell[] = [
  // Truques (Nível 0)
  {
    id: 'light',
    name: 'Luz',
    level: 0,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Toque',
    components: 'V, M (um vaga-lume ou musgo fosforescente)',
    duration: '1 hora',
    description: 'Você toca um objeto que não tenha mais de 3 metros em qualquer dimensão. Até a magia terminar, o objeto emite luz plena em um raio de 6 metros e penumbra por mais 6 metros. A luz pode ser de qualquer cor que você escolher. Cobrir o objeto com algo opaco bloqueia a luz. A magia termina se você conjurá-la novamente ou dispensá-la como uma ação. Se você mirar em um objeto segurado ou vestido por uma criatura hostil, a criatura deve ter sucesso em um teste de resistência de Destreza para evitar a magia.',
    classes: ['Bardo', 'Clérigo', 'Feiticeiro', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  {
    id: 'fire-bolt',
    name: 'Rajada de Fogo',
    level: 0,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '36 metros',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Você arremessa uma partícula de fogo em uma criatura ou objeto dentro do alcance. Faça um ataque à distância com magia contra o alvo. Se atingir, o alvo sofre 1d10 de dano de fogo. Um objeto inflamável atingido por esta magia incendeia se não estiver sendo vestido ou carregado. O dano desta magia aumenta em 1d10 quando você alcança o 5º nível (2d10), 11º nível (3d10) e 17º nível (4d10).',
    classes: ['Feiticeiro', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  {
    id: 'mage-hand',
    name: 'Mão Mágica',
    level: 0,
    school: 'Conjuração',
    castingTime: '1 ação',
    range: '9 metros',
    components: 'V, S',
    duration: '1 minuto',
    description: 'Uma mão espectral e flutuante aparece em um ponto que você escolher dentro do alcance. A mão permanece pela duração ou até você dispensá-la como uma ação. A mão desaparece se ficar a mais de 9 metros de você ou se você conjurar esta magia novamente. Você pode usar sua ação para controlar a mão. Você pode usá-la para manipular um objeto, abrir uma porta ou recipiente destrancado, guardar ou recuperar um item de um recipiente aberto ou despejar o conteúdo de um frasco. Você pode mover a mão até 9 metros cada vez que a usar. A mão não pode atacar, ativar itens mágicos ou carregar mais de 5 quilos.',
    classes: ['Bardo', 'Feiticeiro', 'Bruxo', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  {
    id: 'prestidigitation',
    name: 'Prestidigitação',
    level: 0,
    school: 'Transmutação',
    castingTime: '1 ação',
    range: '3 metros',
    components: 'V, S',
    duration: 'Até 1 hora',
    description: 'Esta magia é um truque mágico menor que conjuradores novatos usam para praticar. Você cria um dos seguintes efeitos mágicos dentro do alcance: cria um efeito sensorial inofensivo e instantâneo, como uma chuva de faíscas, uma rajada de vento, notas musicais suaves ou um odor estranho; acende ou apaga instantaneamente uma vela, tocha ou pequena fogueira; limpa ou suja instantaneamente um objeto que não tenha mais de 30 centímetros cúbicos; esfria, aquece ou adiciona sabor a até 30 centímetros cúbicos de material não vivo por 1 hora; faz uma cor, uma pequena marca ou um símbolo aparecer em um objeto ou superfície por 1 hora; cria uma bugiganga não mágica ou uma imagem ilusória que cabe na palma da sua mão e que dura até o final do seu próximo turno.',
    classes: ['Bardo', 'Feiticeiro', 'Bruxo', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  {
    id: 'sacred-flame',
    name: 'Chama Sagrada',
    level: 0,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '18 metros',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Uma radiância semelhante a uma chama desce sobre uma criatura que você pode ver dentro do alcance. O alvo deve ter sucesso em um teste de resistência de Destreza ou sofrer 1d8 de dano radiante. O alvo não recebe nenhum benefício de cobertura para este teste de resistência. O dano desta magia aumenta em 1d8 quando você alcança o 5º nível (2d8), 11º nível (3d8) e 17º nível (4d8).',
    classes: ['Clérigo'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  // Nível 1
  {
    id: 'magic-missile',
    name: 'Mísseis Mágicos',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '36 metros',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Você cria três dardos brilhantes de força mágica. Cada dardo atinge uma criatura de sua escolha que você possa ver dentro do alcance. Cada dardo causa 1d4+1 de dano de força. Os dardos atingem simultaneamente, e você pode direcioná-los para atingir uma criatura ou várias.',
    higherLevels: 'Quando você conjura esta magia usando um espaço de magia de 2º nível ou superior, a magia cria um dardo adicional para cada nível de espaço acima do 1º.',
    classes: ['Feiticeiro', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  {
    id: 'shield',
    name: 'Escudo Arcano',
    level: 1,
    school: 'Abjuração',
    castingTime: '1 reação, que você realiza quando é atingido por um ataque ou alvo da magia mísseis mágicos',
    range: 'Pessoal',
    components: 'V, S',
    duration: '1 rodada',
    description: 'Uma barreira invisível de força mágica aparece e protege você. Até o início do seu próximo turno, você tem um bônus de +5 na CA, inclusive contra o ataque que desencadeou a magia, e você não sofre dano de mísseis mágicos.',
    classes: ['Feiticeiro', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  {
    id: 'cure-wounds',
    name: 'Curar Ferimentos',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Toque',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Uma criatura que você toca recupera um número de pontos de vida igual a 1d8 + seu modificador de habilidade de conjuração. Esta magia não tem efeito em mortos-vivos ou constructos.',
    higherLevels: 'Quando você conjura esta magia usando um espaço de magia de 2º nível ou superior, a cura aumenta em 1d8 para cada nível de espaço acima do 1º.',
    classes: ['Bardo', 'Clérigo', 'Druida', 'Paladino', 'Patrulheiro'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  {
    id: 'detect-magic',
    name: 'Detectar Magia',
    level: 1,
    school: 'Adivinhação',
    castingTime: '1 ação',
    range: 'Pessoal',
    components: 'V, S',
    duration: 'Concentração, até 10 minutos',
    description: 'Durante a duração, você sente a presença de magia a até 9 metros de você. Se você sentir magia dessa forma, pode usar sua ação para ver uma aura fraca ao redor de qualquer criatura ou objeto visível na área que tenha magia, e você descobre sua escola de magia, se houver. A magia pode penetrar a maioria das barreiras, mas é bloqueada por 30 centímetros de pedra, 2,5 centímetros de metal comum, uma fina folha de chumbo ou 90 centímetros de madeira ou terra.',
    classes: ['Bardo', 'Clérigo', 'Druida', 'Paladino', 'Patrulheiro', 'Feiticeiro', 'Mago'],
    ritual: true,
    concentration: true,
    source: 'SRD',
  },
  {
    id: 'thunderwave',
    name: 'Onda Trovejante',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Pessoal (cubo de 4,5 metros)',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Uma onda de força trovejante varre a partir de você. Cada criatura em um cubo de 4,5 metros originando de você deve fazer um teste de resistência de Constituição. Em uma falha, uma criatura sofre 2d8 de dano de trovão e é empurrada 3 metros para longe de você. Em um sucesso, a criatura sofre metade do dano e não é empurrada. Além disso, objetos não seguros que estejam completamente dentro da área de efeito são automaticamente empurrados 3 metros para longe de você pelo efeito da magia, e a magia emite um estrondo trovejante audível a até 90 metros.',
    higherLevels: 'Quando você conjura esta magia usando um espaço de magia de 2º nível ou superior, o dano aumenta em 1d8 para cada nível de espaço acima do 1º.',
    classes: ['Bardo', 'Druida', 'Feiticeiro', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  // Nível 2
  {
    id: 'invisibility',
    name: 'Invisibilidade',
    level: 2,
    school: 'Ilusão',
    castingTime: '1 ação',
    range: 'Toque',
    components: 'V, S, M (um cílio envolto em goma arábica)',
    duration: 'Concentração, até 1 hora',
    description: 'Uma criatura que você toca se torna invisível até a magia terminar. Qualquer coisa que o alvo esteja vestindo ou carregando é invisível enquanto estiver no corpo do alvo. A magia termina para um alvo que ataca ou conjura uma magia.',
    higherLevels: 'Quando você conjura esta magia usando um espaço de magia de 3º nível ou superior, você pode ter como alvo uma criatura adicional para cada nível de espaço acima do 2º.',
    classes: ['Bardo', 'Feiticeiro', 'Bruxo', 'Mago'],
    ritual: false,
    concentration: true,
    source: 'SRD',
  },
  {
    id: 'hold-person',
    name: 'Imobilizar Pessoa',
    level: 2,
    school: 'Encantamento',
    castingTime: '1 ação',
    range: '18 metros',
    components: 'V, S, M (um pequeno pedaço de ferro)',
    duration: 'Concentração, até 1 minuto',
    description: 'Escolha um humanoide que você possa ver dentro do alcance. O alvo deve ter sucesso em um teste de resistência de Sabedoria ou ficará paralisado pela duração. No final de cada um de seus turnos, o alvo pode fazer outro teste de resistência de Sabedoria. Em um sucesso, a magia termina para o alvo.',
    higherLevels: 'Quando você conjura esta magia usando um espaço de magia de 3º nível ou superior, você pode ter como alvo um humanoide adicional para cada nível de espaço acima do 2º. Os humanoides devem estar a até 9 metros um do outro quando você os selecionar como alvo.',
    classes: ['Bardo', 'Clérigo', 'Druida', 'Feiticeiro', 'Bruxo', 'Mago'],
    ritual: false,
    concentration: true,
    source: 'SRD',
  },
  // Nível 3
  {
    id: 'fireball',
    name: 'Bola de Fogo',
    level: 3,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '45 metros',
    components: 'V, S, M (uma pequena bola de guano de morcego e enxofre)',
    duration: 'Instantânea',
    description: 'Um ponto brilhante sai do seu dedo indicador para um ponto que você escolher dentro do alcance e então floresce com um estrondo grave em uma explosão de chamas. Cada criatura em uma esfera de 6 metros de raio centrada naquele ponto deve fazer um teste de resistência de Destreza. Um alvo sofre 8d6 de dano de fogo em uma falha, ou metade do dano em um sucesso. O fogo se espalha ao redor dos cantos. Ele incendeia objetos inflamáveis na área que não estejam sendo vestidos ou carregados.',
    higherLevels: 'Quando você conjura esta magia usando um espaço de magia de 4º nível ou superior, o dano aumenta em 1d6 para cada nível de espaço acima do 3º.',
    classes: ['Feiticeiro', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  {
    id: 'counterspell',
    name: 'Contramágica',
    level: 3,
    school: 'Abjuração',
    castingTime: '1 reação, que você realiza quando vê uma criatura a até 18 metros de você conjurando uma magia',
    range: '18 metros',
    components: 'S',
    duration: 'Instantânea',
    description: 'Você tenta interromper uma criatura no ato de conjurar uma magia. Se a criatura estiver conjurando uma magia de 3º nível ou inferior, sua magia falha e não tem efeito. Se estiver conjurando uma magia de 4º nível ou superior, faça um teste de habilidade usando sua habilidade de conjuração. A CD é igual a 10 + o nível da magia. Em um sucesso, a magia da criatura falha e não tem efeito.',
    higherLevels: 'Quando você conjura esta magia usando um espaço de magia de 4º nível ou superior, a magia interrompida não tem efeito se seu nível for igual ou menor que o nível do espaço de magia que você usou.',
    classes: ['Feiticeiro', 'Bruxo', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  {
    id: 'dispel-magic',
    name: 'Dissipar Magia',
    level: 3,
    school: 'Abjuração',
    castingTime: '1 ação',
    range: '36 metros',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Escolha uma criatura, objeto ou efeito mágico dentro do alcance. Qualquer magia de 3º nível ou inferior no alvo termina. Para cada magia de 4º nível ou superior no alvo, faça um teste de habilidade usando sua habilidade de conjuração. A CD é igual a 10 + o nível da magia. Em um sucesso, a magia termina.',
    higherLevels: 'Quando você conjura esta magia usando um espaço de magia de 4º nível ou superior, você automaticamente termina os efeitos de uma magia no alvo se o nível da magia for igual ou menor que o nível do espaço de magia que você usou.',
    classes: ['Bardo', 'Clérigo', 'Druida', 'Paladino', 'Feiticeiro', 'Bruxo', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  // Nível 4
  {
    id: 'greater-invisibility',
    name: 'Invisibilidade Maior',
    level: 4,
    school: 'Ilusão',
    castingTime: '1 ação',
    range: 'Toque',
    components: 'V, S',
    duration: 'Concentração, até 1 minuto',
    description: 'Você ou uma criatura que você toca se torna invisível até a magia terminar. Qualquer coisa que o alvo esteja vestindo ou carregando é invisível enquanto estiver no corpo do alvo.',
    classes: ['Bardo', 'Feiticeiro', 'Mago'],
    ritual: false,
    concentration: true,
    source: 'SRD',
  },
  {
    id: 'dimension-door',
    name: 'Porta Dimensional',
    level: 4,
    school: 'Conjuração',
    castingTime: '1 ação',
    range: '150 metros',
    components: 'V',
    duration: 'Instantânea',
    description: 'Você se teletransporta do seu local atual para qualquer outro ponto dentro do alcance. Você chega exatamente no local desejado. Pode ser um lugar que você pode ver, um que você pode visualizar ou um que você pode descrever indicando a direção e a distância, como "60 metros diretamente para baixo" ou "para cima a noroeste em um ângulo de 45 graus, 90 metros". Você pode trazer objetos desde que seu peso não exceda o que você pode carregar. Você também pode trazer uma criatura voluntária de seu tamanho ou menor que esteja carregando equipamento até sua capacidade de carga. A criatura deve estar a até 1,5 metro de você quando você conjura esta magia.',
    classes: ['Bardo', 'Feiticeiro', 'Bruxo', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  // Nível 5
  {
    id: 'cone-of-cold',
    name: 'Cone de Frio',
    level: 5,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Pessoal (cone de 18 metros)',
    components: 'V, S, M (um pequeno cone de cristal ou vidro)',
    duration: 'Instantânea',
    description: 'Uma rajada de ar frio sai de suas mãos. Cada criatura em um cone de 18 metros deve fazer um teste de resistência de Constituição. Uma criatura sofre 8d8 de dano de frio em uma falha, ou metade do dano em um sucesso. Uma criatura morta por esta magia se torna uma estátua de gelo até descongelar.',
    higherLevels: 'Quando você conjura esta magia usando um espaço de magia de 6º nível ou superior, o dano aumenta em 1d8 para cada nível de espaço acima do 5º.',
    classes: ['Feiticeiro', 'Mago'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
  {
    id: 'raise-dead',
    name: 'Reviver os Mortos',
    level: 5,
    school: 'Necromancia',
    castingTime: '1 hora',
    range: 'Toque',
    components: 'V, S, M (um diamante no valor de pelo menos 500 po, que a magia consome)',
    duration: 'Instantânea',
    description: 'Você devolve a vida a uma criatura morta que você toca, desde que ela não tenha morrido há mais de 10 dias. Se a alma da criatura estiver livre e disposta, a criatura volta à vida com 1 ponto de vida. Esta magia também neutraliza quaisquer venenos e cura doenças não mágicas que afetavam a criatura no momento de sua morte. Esta magia não remove, no entanto, doenças mágicas, maldições ou efeitos semelhantes; se estes não forem removidos antes de conjurar a magia, eles afetam o alvo quando ele voltar à vida. Esta magia não pode retornar um morto-vivo à vida. Esta magia fecha todas as feridas mortais, mas não restaura partes do corpo perdidas.',
    classes: ['Bardo', 'Clérigo', 'Paladino'],
    ritual: false,
    concentration: false,
    source: 'SRD',
  },
]

export function getSpellsByLevel(spells: Spell[]): Map<number, Spell[]> {
  const grouped = new Map<number, Spell[]>()
  for (let i = 0; i <= 9; i++) {
    grouped.set(i, [])
  }
  for (const spell of spells) {
    grouped.get(spell.level)?.push(spell)
  }
  return grouped
}

export function getSpellsByClass(spells: Spell[], characterClass: CharacterClass): Spell[] {
  return spells.filter(spell => spell.classes.includes(characterClass))
}

export function getSpellsBySchool(spells: Spell[], school: SpellSchool): Spell[] {
  return spells.filter(spell => spell.school === school)
}

export function searchSpells(spells: Spell[], query: string): Spell[] {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return spells
  
  return spells.filter(spell => 
    spell.name.toLowerCase().includes(normalizedQuery) ||
    spell.description.toLowerCase().includes(normalizedQuery) ||
    spell.school.toLowerCase().includes(normalizedQuery)
  )
}
