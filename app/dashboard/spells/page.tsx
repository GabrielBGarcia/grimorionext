'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search, Filter, BookOpen, Clock, Target, Sparkles } from 'lucide-react'
import { 
  SRD_SPELLS, 
  SPELL_LEVEL_NAMES, 
  SPELL_SCHOOLS,
  searchSpells,
  type Spell,
  type SpellSchool,
  type CharacterClass
} from '@/lib/data/spells'
import { CLASSES } from '@/lib/data/constants'

const SPELL_CASTER_CLASSES = ['Bardo', 'Bruxo', 'Clérigo', 'Druida', 'Feiticeiro', 'Mago', 'Paladino', 'Patrulheiro'] as const

function getSchoolColor(school: SpellSchool): string {
  const colors: Record<SpellSchool, string> = {
    'Abjuração': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Conjuração': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Adivinhação': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Encantamento': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'Evocação': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Ilusão': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'Necromancia': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Transmutação': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  }
  return colors[school]
}

function getLevelColor(level: number): string {
  const colors = [
    'bg-gray-500/20 text-gray-300', // 0
    'bg-blue-500/20 text-blue-300', // 1
    'bg-indigo-500/20 text-indigo-300', // 2
    'bg-purple-500/20 text-purple-300', // 3
    'bg-violet-500/20 text-violet-300', // 4
    'bg-orange-500/20 text-orange-300', // 5
    'bg-amber-500/20 text-amber-300', // 6
    'bg-yellow-500/20 text-yellow-300', // 7
    'bg-red-500/20 text-red-300', // 8
    'bg-rose-500/20 text-rose-300', // 9
  ]
  return colors[level] || colors[0]
}

export default function SpellsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [schoolFilter, setSchoolFilter] = useState<string>('all')
  const [classFilter, setClassFilter] = useState<string>('all')
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null)

  const filteredSpells = useMemo(() => {
    let spells = searchSpells(SRD_SPELLS, searchQuery)
    
    if (levelFilter !== 'all') {
      spells = spells.filter(s => s.level === parseInt(levelFilter))
    }
    
    if (schoolFilter !== 'all') {
      spells = spells.filter(s => s.school === schoolFilter)
    }
    
    if (classFilter !== 'all') {
      spells = spells.filter(s => s.classes.includes(classFilter as CharacterClass))
    }
    
    return spells.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level
      return a.name.localeCompare(b.name)
    })
  }, [searchQuery, levelFilter, schoolFilter, classFilter])

  const groupedSpells = useMemo(() => {
    const groups = new Map<number, Spell[]>()
    for (let i = 0; i <= 9; i++) {
      groups.set(i, [])
    }
    for (const spell of filteredSpells) {
      groups.get(spell.level)?.push(spell)
    }
    return groups
  }, [filteredSpells])

  const clearFilters = () => {
    setSearchQuery('')
    setLevelFilter('all')
    setSchoolFilter('all')
    setClassFilter('all')
  }

  const hasActiveFilters = searchQuery || levelFilter !== 'all' || schoolFilter !== 'all' || classFilter !== 'all'

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          Grimório de Magias
        </h1>
        <p className="text-muted-foreground mt-1">
          {SRD_SPELLS.length} magias disponíveis no SRD
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar magias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[140px] bg-input border-border">
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Níveis</SelectItem>
                  {Object.entries(SPELL_LEVEL_NAMES).map(([level, name]) => (
                    <SelectItem key={level} value={level}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger className="w-[160px] bg-input border-border">
                  <SelectValue placeholder="Escola" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Escolas</SelectItem>
                  {Object.keys(SPELL_SCHOOLS).map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[140px] bg-input border-border">
                  <SelectValue placeholder="Classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Classes</SelectItem>
                  {SPELL_CASTER_CLASSES.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        {filteredSpells.length} magia{filteredSpells.length !== 1 ? 's' : ''} encontrada{filteredSpells.length !== 1 ? 's' : ''}
      </div>

      {/* Spells List */}
      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-6">
          {Array.from(groupedSpells.entries()).map(([level, spells]) => {
            if (spells.length === 0) return null
            return (
              <div key={level}>
                <h2 className="font-display text-lg font-semibold text-foreground mb-3 sticky top-0 bg-background py-2 z-10">
                  {SPELL_LEVEL_NAMES[level]}
                  <span className="text-muted-foreground font-normal text-sm ml-2">
                    ({spells.length})
                  </span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {spells.map((spell) => (
                    <Card
                      key={spell.id}
                      className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer card-hover"
                      onClick={() => setSelectedSpell(spell)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base text-foreground leading-tight">
                            {spell.name}
                          </CardTitle>
                          <Badge variant="outline" className={getLevelColor(spell.level)}>
                            {spell.level === 0 ? 'Truque' : `${spell.level}º`}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getSchoolColor(spell.school)}>
                            {spell.school}
                          </Badge>
                          {spell.concentration && (
                            <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                              C
                            </Badge>
                          )}
                          {spell.ritual && (
                            <Badge variant="outline" className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                              R
                            </Badge>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {spell.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Spell Detail Dialog */}
      <Dialog open={!!selectedSpell} onOpenChange={() => setSelectedSpell(null)}>
        {selectedSpell && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                {selectedSpell.name}
              </DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2 pt-2">
                <Badge variant="outline" className={getLevelColor(selectedSpell.level)}>
                  {SPELL_LEVEL_NAMES[selectedSpell.level]}
                </Badge>
                <Badge variant="outline" className={getSchoolColor(selectedSpell.school)}>
                  {selectedSpell.school}
                </Badge>
                {selectedSpell.concentration && (
                  <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                    Concentração
                  </Badge>
                )}
                {selectedSpell.ritual && (
                  <Badge variant="outline" className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                    Ritual
                  </Badge>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Spell Info */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tempo de Conjuração:</span>
                  <span className="text-foreground">{selectedSpell.castingTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Alcance:</span>
                  <span className="text-foreground">{selectedSpell.range}</span>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">Componentes:</span>{' '}
                <span className="text-foreground">{selectedSpell.components}</span>
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">Duração:</span>{' '}
                <span className="text-foreground">{selectedSpell.duration}</span>
              </div>

              {/* Description */}
              <div className="pt-2 border-t border-border">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedSpell.description}
                </p>
              </div>

              {/* Higher Levels */}
              {selectedSpell.higherLevels && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-medium text-primary mb-1">Em Níveis Superiores</p>
                  <p className="text-foreground text-sm leading-relaxed">
                    {selectedSpell.higherLevels}
                  </p>
                </div>
              )}

              {/* Classes */}
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Classes</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSpell.classes.map((cls) => (
                    <Badge key={cls} variant="secondary">
                      {cls}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Source */}
              <div className="text-xs text-muted-foreground pt-2">
                Fonte: {selectedSpell.source}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
