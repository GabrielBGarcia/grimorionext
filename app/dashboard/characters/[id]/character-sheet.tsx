'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  updateCharacter, 
  updateCharacterHP, 
  updateAttributes,
  updateSavingThrowProfs,
  updateSkillProfs,
  updateConditions,
  toggleInspiration,
  longRest,
  shortRest,
  useHitDice,
  updateDeathSaves,
  deleteCharacter
} from '@/app/actions/characters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  Shield, 
  Zap, 
  Footprints, 
  Plus, 
  Minus, 
  Sparkles, 
  Moon, 
  Sun,
  Skull,
  Edit,
  MoreHorizontal,
  Trash2,
  BookOpen,
  Backpack,
  Dices,
  Save,
  X
} from 'lucide-react'
import { 
  ATTRIBUTES, 
  SKILLS, 
  getModifier, 
  formatModifier, 
  getProficiencyBonus 
} from '@/lib/data/constants'
import type { Character } from '@/lib/db/schema'
import { cn } from '@/lib/utils'

const CONDITIONS = [
  'Amedrontado', 'Atordoado', 'Caído', 'Cego', 'Encantado', 
  'Enfeitiçado', 'Envenenado', 'Exausto', 'Incapacitado', 
  'Invisível', 'Paralisado', 'Petrificado', 'Restringido', 'Surdo'
]

interface CharacterSheetProps {
  character: Character
}

export function CharacterSheet({ character }: CharacterSheetProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const attributes = character.attributes as Record<string, number>
  const proficiencyBonus = getProficiencyBonus(character.level)
  const savingThrowProfs = (character.savingThrowProfs ?? []) as string[]
  const skillProfs = (character.skillProfs ?? []) as string[]
  const expertSkills = (character.expertSkills ?? []) as string[]
  const conditions = (character.conditions ?? []) as string[]
  const deathSaves = (character.deathSaves ?? { success: [false, false, false], failure: [false, false, false] }) as { success: boolean[]; failure: boolean[] }
  
  // Local state for editing
  const [editingHP, setEditingHP] = useState(false)
  const [hpValue, setHpValue] = useState(character.hitPointsCurrent)
  const [tempHpValue, setTempHpValue] = useState(character.hitPointsTemp ?? 0)
  
  const [editingAttributes, setEditingAttributes] = useState(false)
  const [attrValues, setAttrValues] = useState(attributes)
  
  const [editingSkills, setEditingSkills] = useState(false)
  const [localSkillProfs, setLocalSkillProfs] = useState<string[]>(skillProfs)
  const [localExpertSkills, setLocalExpertSkills] = useState<string[]>(expertSkills)
  const [localSaveProfs, setLocalSaveProfs] = useState<string[]>(savingThrowProfs)
  
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [notesValue, setNotesValue] = useState(character.notes ?? '')

  // HP functions
  const adjustHP = (amount: number) => {
    const newHP = Math.max(0, Math.min(character.hitPointsMax, character.hitPointsCurrent + amount))
    startTransition(async () => {
      await updateCharacterHP(character.id, newHP, character.hitPointsTemp ?? 0)
      router.refresh()
    })
  }

  const saveHP = () => {
    startTransition(async () => {
      await updateCharacterHP(character.id, Math.min(hpValue, character.hitPointsMax), tempHpValue)
      setEditingHP(false)
      router.refresh()
    })
  }

  const saveAttributes = () => {
    startTransition(async () => {
      await updateAttributes(character.id, attrValues as { str: number; dex: number; con: number; int: number; wis: number; cha: number })
      setEditingAttributes(false)
      router.refresh()
    })
  }

  const saveSkillProfs = () => {
    startTransition(async () => {
      await updateSkillProfs(character.id, localSkillProfs, localExpertSkills)
      await updateSavingThrowProfs(character.id, localSaveProfs)
      setEditingSkills(false)
      router.refresh()
    })
  }

  const handleToggleInspiration = () => {
    startTransition(async () => {
      await toggleInspiration(character.id, !character.inspiration)
      router.refresh()
    })
  }

  const handleLongRest = () => {
    startTransition(async () => {
      await longRest(character.id)
      router.refresh()
    })
  }

  const handleShortRest = () => {
    startTransition(async () => {
      await shortRest(character.id)
      router.refresh()
    })
  }

  const handleUseHitDice = () => {
    startTransition(async () => {
      await useHitDice(character.id)
      router.refresh()
    })
  }

  const toggleCondition = (condition: string) => {
    const newConditions = conditions.includes(condition)
      ? conditions.filter(c => c !== condition)
      : [...conditions, condition]
    
    startTransition(async () => {
      await updateConditions(character.id, newConditions)
      router.refresh()
    })
  }

  const handleDeathSaveToggle = (type: 'success' | 'failure', index: number) => {
    const newDeathSaves = { ...deathSaves }
    newDeathSaves[type][index] = !newDeathSaves[type][index]
    
    startTransition(async () => {
      await updateDeathSaves(character.id, newDeathSaves)
      router.refresh()
    })
  }

  const handleSaveNotes = () => {
    startTransition(async () => {
      await updateCharacter(character.id, { notes: notesValue })
      setNotesDialogOpen(false)
      router.refresh()
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCharacter(character.id)
      router.push('/dashboard/characters')
    })
  }

  const hitDiceRemaining = character.level - (character.hitDiceUsed ?? 0)
  const isUnconscious = character.hitPointsCurrent === 0

  return (
    <div className="space-y-6">
      {/* Character Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary font-display text-2xl font-bold shrink-0">
            {character.level}
          </div>
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
              {character.name}
              {character.inspiration && (
                <Sparkles className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              )}
            </h1>
            <p className="text-muted-foreground">
              {character.race} {character.characterClass}
              {character.subclass && ` (${character.subclass})`}
            </p>
            {character.background && (
              <p className="text-sm text-muted-foreground">
                Antecedente: {character.background}
              </p>
            )}
            {conditions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {conditions.map(c => (
                  <Badge key={c} variant="destructive" className="text-xs">
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={character.inspiration ? "default" : "outline"}
            size="sm"
            onClick={handleToggleInspiration}
            disabled={isPending}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Inspiração
          </Button>
          
          <Dialog open={conditionDialogOpen} onOpenChange={setConditionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Skull className="h-4 w-4 mr-1" />
                Condições
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Condições</DialogTitle>
                <DialogDescription>
                  Selecione as condições que afetam {character.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2 py-4">
                {CONDITIONS.map(condition => (
                  <label key={condition} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={conditions.includes(condition)}
                      onCheckedChange={() => toggleCondition(condition)}
                    />
                    <span className="text-sm">{condition}</span>
                  </label>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setNotesDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Notas
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Personagem
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Combat Stats Row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {/* HP Card */}
        <Card className={cn("bg-card border-border col-span-2 lg:col-span-1", isUnconscious && "border-destructive")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className={cn("h-5 w-5", isUnconscious ? "text-destructive" : "text-red-400")} />
                <span className="text-sm text-muted-foreground">Pontos de Vida</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                setHpValue(character.hitPointsCurrent)
                setTempHpValue(character.hitPointsTemp ?? 0)
                setEditingHP(!editingHP)
              }}>
                {editingHP ? <X className="h-3 w-3" /> : <Edit className="h-3 w-3" />}
              </Button>
            </div>
            
            {editingHP ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={hpValue}
                    onChange={(e) => setHpValue(parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                  <span className="text-muted-foreground">/</span>
                  <span className="text-foreground font-bold">{character.hitPointsMax}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-400">Temp:</span>
                  <Input
                    type="number"
                    value={tempHpValue}
                    onChange={(e) => setTempHpValue(parseInt(e.target.value) || 0)}
                    className="h-6 text-xs w-16"
                  />
                </div>
                <Button size="sm" className="w-full h-7" onClick={saveHP} disabled={isPending}>
                  <Save className="h-3 w-3 mr-1" /> Salvar
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => adjustHP(-1)}
                    disabled={isPending}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold text-foreground min-w-[80px] text-center">
                    {character.hitPointsCurrent}
                    <span className="text-muted-foreground text-lg">/{character.hitPointsMax}</span>
                  </span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => adjustHP(1)}
                    disabled={isPending}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {(character.hitPointsTemp ?? 0) > 0 && (
                  <p className="text-xs text-blue-400 text-center mt-1">+{character.hitPointsTemp} temporário</p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* AC */}
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Classe de Armadura</p>
              <p className="text-xl font-bold text-foreground">{character.armorClass}</p>
            </div>
          </CardContent>
        </Card>

        {/* Initiative */}
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
              <Zap className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Iniciativa</p>
              <p className="text-xl font-bold text-foreground">
                {formatModifier(character.initiative ?? getModifier(attributes.dex ?? 10))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Speed */}
        <Card className="bg-card border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Footprints className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deslocamento</p>
              <p className="text-xl font-bold text-foreground">{character.speed ?? 9}m</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Death Saves (only show when at 0 HP) */}
      {isUnconscious && (
        <Card className="bg-card border-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <Skull className="h-4 w-4" />
              Testes contra a Morte
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-400 w-20">Sucessos:</span>
              {[0, 1, 2].map(i => (
                <Checkbox
                  key={`success-${i}`}
                  checked={deathSaves.success[i]}
                  onCheckedChange={() => handleDeathSaveToggle('success', i)}
                  className="border-green-400 data-[state=checked]:bg-green-500"
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-destructive w-20">Falhas:</span>
              {[0, 1, 2].map(i => (
                <Checkbox
                  key={`failure-${i}`}
                  checked={deathSaves.failure[i]}
                  onCheckedChange={() => handleDeathSaveToggle('failure', i)}
                  className="border-destructive data-[state=checked]:bg-destructive"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rest & Hit Dice */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Dices className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Dados de Vida:</span>
                <span className="font-bold text-foreground">
                  {hitDiceRemaining}{character.hitDiceType}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleUseHitDice}
                disabled={isPending || hitDiceRemaining <= 0}
              >
                Usar Dado de Vida
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShortRest} disabled={isPending}>
                <Sun className="h-4 w-4 mr-1" />
                Descanso Curto
              </Button>
              <Button variant="default" size="sm" onClick={handleLongRest} disabled={isPending}>
                <Moon className="h-4 w-4 mr-1" />
                Descanso Longo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Atributos</TabsTrigger>
          <TabsTrigger value="skills">Perícias</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>

        {/* Attributes Tab */}
        <TabsContent value="stats" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display">Atributos</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    if (editingAttributes) {
                      setAttrValues(attributes)
                    }
                    setEditingAttributes(!editingAttributes)
                  }}
                >
                  {editingAttributes ? <X className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
                  {editingAttributes ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                {ATTRIBUTES.map((attr) => {
                  const score = editingAttributes ? (attrValues[attr.id] ?? 10) : (attributes[attr.id] ?? 10)
                  const mod = getModifier(score)
                  return (
                    <div
                      key={attr.id}
                      className="flex flex-col items-center p-3 rounded-lg bg-secondary/50 border border-border"
                    >
                      <span className="text-xs text-muted-foreground font-medium">
                        {attr.abbr}
                      </span>
                      {editingAttributes ? (
                        <Input
                          type="number"
                          min={1}
                          max={30}
                          value={score}
                          onChange={(e) => setAttrValues({ ...attrValues, [attr.id]: parseInt(e.target.value) || 10 })}
                          className="w-14 h-8 text-center text-lg font-bold mt-1"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-foreground mt-1">
                          {score}
                        </span>
                      )}
                      <span className="text-sm text-primary font-medium">
                        {formatModifier(mod)}
                      </span>
                    </div>
                  )
                })}
              </div>
              {editingAttributes && (
                <Button className="w-full mt-4" onClick={saveAttributes} disabled={isPending}>
                  <Save className="h-4 w-4 mr-2" /> Salvar Atributos
                </Button>
              )}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Bônus de Proficiência:</span>
                <span className="text-primary font-bold">+{proficiencyBonus}</span>
              </div>
            </CardContent>
          </Card>

          {/* Saving Throws */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display">Testes de Resistência</CardTitle>
                {!editingSkills && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingSkills(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {ATTRIBUTES.map((attr) => {
                  const score = attributes[attr.id] ?? 10
                  const mod = getModifier(score)
                  const isProficient = editingSkills ? localSaveProfs.includes(attr.id) : savingThrowProfs.includes(attr.id)
                  const total = mod + (isProficient ? proficiencyBonus : 0)
                  
                  return (
                    <div
                      key={attr.id}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded border",
                        isProficient ? "border-primary bg-primary/5" : "border-border"
                      )}
                    >
                      {editingSkills ? (
                        <Checkbox
                          checked={isProficient}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setLocalSaveProfs([...localSaveProfs, attr.id])
                            } else {
                              setLocalSaveProfs(localSaveProfs.filter(s => s !== attr.id))
                            }
                          }}
                        />
                      ) : (
                        <div className={cn(
                          "h-3 w-3 rounded-full border-2",
                          isProficient ? "bg-primary border-primary" : "border-muted-foreground"
                        )} />
                      )}
                      <span className="text-sm flex-1">{attr.name}</span>
                      <span className={cn(
                        "font-mono font-bold text-sm",
                        isProficient ? "text-primary" : "text-foreground"
                      )}>
                        {formatModifier(total)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display">Perícias</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    if (editingSkills) {
                      setLocalSkillProfs(skillProfs)
                      setLocalExpertSkills(expertSkills)
                      setLocalSaveProfs(savingThrowProfs)
                    }
                    setEditingSkills(!editingSkills)
                  }}
                >
                  {editingSkills ? <X className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
                  {editingSkills ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-1">
                {SKILLS.map((skill) => {
                  const attrScore = attributes[skill.attribute] ?? 10
                  const attrMod = getModifier(attrScore)
                  const isProficient = editingSkills ? localSkillProfs.includes(skill.id) : skillProfs.includes(skill.id)
                  const isExpert = editingSkills ? localExpertSkills.includes(skill.id) : expertSkills.includes(skill.id)
                  const bonus = isExpert ? proficiencyBonus * 2 : (isProficient ? proficiencyBonus : 0)
                  const total = attrMod + bonus
                  const attrAbbr = ATTRIBUTES.find(a => a.id === skill.attribute)?.abbr ?? ''
                  
                  return (
                    <div
                      key={skill.id}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded border",
                        isExpert ? "border-yellow-500 bg-yellow-500/5" :
                        isProficient ? "border-primary bg-primary/5" : "border-transparent"
                      )}
                    >
                      {editingSkills ? (
                        <div className="flex items-center gap-1">
                          <Checkbox
                            checked={isProficient}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setLocalSkillProfs([...localSkillProfs, skill.id])
                              } else {
                                setLocalSkillProfs(localSkillProfs.filter(s => s !== skill.id))
                                setLocalExpertSkills(localExpertSkills.filter(s => s !== skill.id))
                              }
                            }}
                          />
                          <Checkbox
                            checked={isExpert}
                            disabled={!isProficient}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setLocalExpertSkills([...localExpertSkills, skill.id])
                              } else {
                                setLocalExpertSkills(localExpertSkills.filter(s => s !== skill.id))
                              }
                            }}
                            className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                          />
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <div className={cn(
                            "h-3 w-3 rounded-full border-2",
                            isProficient ? "bg-primary border-primary" : "border-muted-foreground"
                          )} />
                          <div className={cn(
                            "h-3 w-3 rounded-full border-2",
                            isExpert ? "bg-yellow-500 border-yellow-500" : "border-muted-foreground/30"
                          )} />
                        </div>
                      )}
                      <span className="text-sm flex-1">{skill.name}</span>
                      <span className="text-xs text-muted-foreground w-8">({attrAbbr})</span>
                      <span className={cn(
                        "font-mono font-bold text-sm w-8 text-right",
                        isExpert ? "text-yellow-500" :
                        isProficient ? "text-primary" : "text-foreground"
                      )}>
                        {formatModifier(total)}
                      </span>
                    </div>
                  )
                })}
              </div>
              {editingSkills && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Primeiro checkbox = proficiência, segundo = expertise (dobra o bônus)
                  </p>
                  <Button className="w-full" onClick={saveSkillProfs} disabled={isPending}>
                    <Save className="h-4 w-4 mr-2" /> Salvar Perícias
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-display">Personalidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.alignment && (
                <div>
                  <p className="text-sm text-muted-foreground">Alinhamento</p>
                  <p className="text-foreground">{character.alignment}</p>
                </div>
              )}
              {character.personality && (
                <div>
                  <p className="text-sm text-muted-foreground">Traços de Personalidade</p>
                  <p className="text-foreground">{character.personality}</p>
                </div>
              )}
              {character.ideals && (
                <div>
                  <p className="text-sm text-muted-foreground">Ideais</p>
                  <p className="text-foreground">{character.ideals}</p>
                </div>
              )}
              {character.bonds && (
                <div>
                  <p className="text-sm text-muted-foreground">Vínculos</p>
                  <p className="text-foreground">{character.bonds}</p>
                </div>
              )}
              {character.flaws && (
                <div>
                  <p className="text-sm text-muted-foreground">Defeitos</p>
                  <p className="text-foreground">{character.flaws}</p>
                </div>
              )}
              {!character.alignment && !character.personality && !character.ideals && !character.bonds && !character.flaws && (
                <p className="text-muted-foreground text-sm">
                  Nenhuma informação de personalidade adicionada ainda.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-display">Notas</CardTitle>
            </CardHeader>
            <CardContent>
              {character.notes ? (
                <p className="text-foreground whitespace-pre-wrap">{character.notes}</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhuma nota adicionada ainda. Use o menu para adicionar notas.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/characters/${character.id}/spells`}>
            <BookOpen className="h-4 w-4 mr-2" />
            Grimório
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/characters/${character.id}/inventory`}>
            <Backpack className="h-4 w-4 mr-2" />
            Inventário
          </Link>
        </Button>
      </div>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Notas</DialogTitle>
            <DialogDescription>
              Adicione anotações sobre {character.name}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            placeholder="Escreva suas notas aqui..."
            className="min-h-[150px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNotes} disabled={isPending}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Personagem</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {character.name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
