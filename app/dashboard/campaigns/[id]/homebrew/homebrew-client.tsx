'use client'

import { useState } from 'react'
import { 
  createHomebrewSpell, deleteHomebrewSpell, 
  createHomebrewItem, deleteHomebrewItem, 
  createHomebrewRace, deleteHomebrewRace, 
  createHomebrewClass, deleteHomebrewClass 
} from '@/app/actions/homebrew'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Plus, Wand2, Sword, Users, BookOpen } from 'lucide-react'
import type { HomebrewSpell, HomebrewItem, HomebrewRace, HomebrewClass } from '@/lib/db/schema'

interface Props {
  campaignId: string
  spells: HomebrewSpell[]
  items: HomebrewItem[]
  races: HomebrewRace[]
  classes: HomebrewClass[]
}

function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const [loading, setLoading] = useState(false)
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-destructive hover:text-destructive h-8 w-8"
      onClick={async () => { setLoading(true); await onDelete(); setLoading(false) }}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}

const schools = ['Abjuração','Adivinhação','Conjuração','Encantamento','Evocação','Ilusão','Necromancia','Transmutação']
const rarities = ['Comum','Incomum','Raro','Muito Raro','Lendário','Artefato'] as const

export function HomebrewClient({ campaignId, spells, items, races, classes }: Props) {
  const [tab, setTab] = useState('spells')
  const [saving, setSaving] = useState(false)

  // Spell form state
  const [spell, setSpell] = useState({ 
    name:'', level:'0', school:'Evocação', castingTime:'1 ação', 
    range:'9m', components:'V, S', duration:'Instantâneo', 
    description:'', higherLevels:'', ritual: false, concentration: false 
  })
  
  // Item form state
  const [item, setItem] = useState({ 
    name:'', type:'Arma', description:'', weight:'0', value:'', 
    rarity:'Comum' as typeof rarities[number], requiresAttunement: false 
  })
  
  // Race form state
  const [race, setRace] = useState({ name:'', speed:'30', size:'Médio', description:'' })
  
  // Class form state
  const [cls, setCls] = useState({ 
    name:'', hitDice:'d8', primaryAbility:'', description:'', spellcaster: false 
  })

  async function saveSpell() {
    if (!spell.name || !spell.description) return
    setSaving(true)
    await createHomebrewSpell(campaignId, { 
      ...spell, 
      level: parseInt(spell.level),
    })
    setSpell({ 
      name:'', level:'0', school:'Evocação', castingTime:'1 ação', 
      range:'9m', components:'V, S', duration:'Instantâneo', 
      description:'', higherLevels:'', ritual: false, concentration: false 
    })
    setSaving(false)
  }

  async function saveItem() {
    if (!item.name || !item.description) return
    setSaving(true)
    await createHomebrewItem(campaignId, { 
      ...item, 
      weight: parseFloat(item.weight) 
    })
    setItem({ name:'', type:'Arma', description:'', weight:'0', value:'', rarity:'Comum', requiresAttunement: false })
    setSaving(false)
  }

  async function saveRace() {
    if (!race.name) return
    setSaving(true)
    await createHomebrewRace(campaignId, { ...race, speed: parseInt(race.speed) })
    setRace({ name:'', speed:'30', size:'Médio', description:'' })
    setSaving(false)
  }

  async function saveClass() {
    if (!cls.name) return
    setSaving(true)
    await createHomebrewClass(campaignId, cls)
    setCls({ name:'', hitDice:'d8', primaryAbility:'', description:'', spellcaster: false })
    setSaving(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" /> 
          Homebrew da Campanha
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Crie conteúdo personalizado para seus jogadores.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="spells"><Wand2 className="h-4 w-4 mr-1"/>Magias ({spells.length})</TabsTrigger>
          <TabsTrigger value="items"><Sword className="h-4 w-4 mr-1"/>Itens ({items.length})</TabsTrigger>
          <TabsTrigger value="races"><Users className="h-4 w-4 mr-1"/>Raças ({races.length})</TabsTrigger>
          <TabsTrigger value="classes"><BookOpen className="h-4 w-4 mr-1"/>Classes ({classes.length})</TabsTrigger>
        </TabsList>

        {/* Magias */}
        <TabsContent value="spells" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base">Nova Magia</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome da magia *</Label>
                <Input placeholder="Nome da magia" value={spell.name} onChange={e => setSpell(s => ({...s, name: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Nível</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  value={spell.level} 
                  onChange={e => setSpell(s => ({...s, level: e.target.value}))}
                >
                  {[0,1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>{l === 0 ? 'Truque' : `${l}º círculo`}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Escola</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  value={spell.school} 
                  onChange={e => setSpell(s => ({...s, school: e.target.value}))}
                >
                  {schools.map(sc => <option key={sc}>{sc}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Tempo de conjuração</Label>
                <Input placeholder="1 ação" value={spell.castingTime} onChange={e => setSpell(s => ({...s, castingTime: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Alcance</Label>
                <Input placeholder="9m" value={spell.range} onChange={e => setSpell(s => ({...s, range: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Componentes</Label>
                <Input placeholder="V, S, M" value={spell.components} onChange={e => setSpell(s => ({...s, components: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Duração</Label>
                <Input placeholder="Instantâneo" value={spell.duration} onChange={e => setSpell(s => ({...s, duration: e.target.value}))} />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox id="ritual" checked={spell.ritual} onCheckedChange={(c) => setSpell(s => ({...s, ritual: !!c}))} />
                  <Label htmlFor="ritual">Ritual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="concentration" checked={spell.concentration} onCheckedChange={(c) => setSpell(s => ({...s, concentration: !!c}))} />
                  <Label htmlFor="concentration">Concentração</Label>
                </div>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Descrição *</Label>
                <Textarea placeholder="Descrição da magia..." rows={3} value={spell.description} onChange={e => setSpell(s => ({...s, description: e.target.value}))} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Em níveis superiores (opcional)</Label>
                <Textarea placeholder="Quando conjurada com um espaço de magia de nível superior..." rows={2} value={spell.higherLevels} onChange={e => setSpell(s => ({...s, higherLevels: e.target.value}))} />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={saveSpell} disabled={saving || !spell.name || !spell.description} className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />{saving ? 'Salvando...' : 'Adicionar Magia'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {spells.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {spells.map(s => (
                <Card key={s.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {s.level === 0 ? 'Truque' : `${s.level}º círculo`} · {s.school}
                          {s.ritual && ' · Ritual'}
                          {s.concentration && ' · Concentração'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                      </div>
                      <DeleteButton onDelete={() => deleteHomebrewSpell(s.id, campaignId)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Itens */}
        <TabsContent value="items" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base">Novo Item</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome do item *</Label>
                <Input placeholder="Nome do item" value={item.name} onChange={e => setItem(i => ({...i, name: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input placeholder="Arma, Armadura, Poção..." value={item.type} onChange={e => setItem(i => ({...i, type: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Raridade</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  value={item.rarity} 
                  onChange={e => setItem(i => ({...i, rarity: e.target.value as typeof rarities[number]}))}
                >
                  {rarities.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Peso (kg)</Label>
                <Input type="number" placeholder="0" value={item.weight} onChange={e => setItem(i => ({...i, weight: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input placeholder="50 po" value={item.value} onChange={e => setItem(i => ({...i, value: e.target.value}))} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="attunement" checked={item.requiresAttunement} onCheckedChange={(c) => setItem(i => ({...i, requiresAttunement: !!c}))} />
                <Label htmlFor="attunement">Requer Sintonização</Label>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Descrição *</Label>
                <Textarea placeholder="Descrição do item..." rows={3} value={item.description} onChange={e => setItem(i => ({...i, description: e.target.value}))} />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={saveItem} disabled={saving || !item.name || !item.description} className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />{saving ? 'Salvando...' : 'Adicionar Item'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {items.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map(it => (
                <Card key={it.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{it.name}</p>
                        <div className="flex gap-2 mt-0.5 flex-wrap">
                          <Badge variant="outline" className="text-xs">{it.type}</Badge>
                          <Badge variant="outline" className="text-xs">{it.rarity}</Badge>
                          {it.requiresAttunement && <Badge variant="outline" className="text-xs">Sintonização</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.description}</p>
                      </div>
                      <DeleteButton onDelete={() => deleteHomebrewItem(it.id, campaignId)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Raças */}
        <TabsContent value="races" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base">Nova Raça</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome da raça *</Label>
                <Input placeholder="Nome da raça" value={race.name} onChange={e => setRace(r => ({...r, name: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Deslocamento (m)</Label>
                <Input type="number" placeholder="30" value={race.speed} onChange={e => setRace(r => ({...r, speed: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Tamanho</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  value={race.size} 
                  onChange={e => setRace(r => ({...r, size: e.target.value}))}
                >
                  {['Minúsculo','Pequeno','Médio','Grande','Enorme','Colossal'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Descrição e traços raciais</Label>
                <Textarea placeholder="Descrição da raça e seus traços..." rows={4} value={race.description} onChange={e => setRace(r => ({...r, description: e.target.value}))} />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={saveRace} disabled={saving || !race.name} className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />{saving ? 'Salvando...' : 'Adicionar Raça'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {races.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {races.map(r => (
                <Card key={r.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.size} · {r.speed}m</p>
                        {r.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>}
                      </div>
                      <DeleteButton onDelete={() => deleteHomebrewRace(r.id, campaignId)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Classes */}
        <TabsContent value="classes" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base">Nova Classe</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome da classe *</Label>
                <Input placeholder="Nome da classe" value={cls.name} onChange={e => setCls(c => ({...c, name: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Dado de Vida</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  value={cls.hitDice} 
                  onChange={e => setCls(c => ({...c, hitDice: e.target.value}))}
                >
                  {['d6','d8','d10','d12'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Atributo Principal</Label>
                <Input placeholder="Força, Destreza..." value={cls.primaryAbility} onChange={e => setCls(c => ({...c, primaryAbility: e.target.value}))} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="spellcaster" checked={cls.spellcaster} onCheckedChange={(c) => setCls(cl => ({...cl, spellcaster: !!c}))} />
                <Label htmlFor="spellcaster">Conjurador</Label>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Descrição</Label>
                <Textarea placeholder="Descrição da classe..." rows={4} value={cls.description} onChange={e => setCls(c => ({...c, description: e.target.value}))} />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={saveClass} disabled={saving || !cls.name} className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />{saving ? 'Salvando...' : 'Adicionar Classe'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {classes.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {classes.map(c => (
                <Card key={c.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{c.name}</p>
                        <div className="flex gap-2 mt-0.5">
                          <Badge variant="outline" className="text-xs">{c.hitDice}</Badge>
                          {c.spellcaster && <Badge variant="outline" className="text-xs">Conjurador</Badge>}
                        </div>
                        {c.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>}
                      </div>
                      <DeleteButton onDelete={() => deleteHomebrewClass(c.id, campaignId)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
