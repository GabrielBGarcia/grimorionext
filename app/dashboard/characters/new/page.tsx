'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createCharacter } from '@/app/actions/characters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { RACES, CLASSES, BACKGROUNDS } from '@/lib/data/constants'

export default function NewCharacterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [name, setName] = useState('')
  const [race, setRace] = useState('')
  const [characterClass, setCharacterClass] = useState('')
  const [level, setLevel] = useState(1)
  const [background, setBackground] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await createCharacter({
        name,
        race,
        characterClass,
        level,
        background: background || undefined,
      })
      router.push(`/dashboard/characters/${result.id}`)
    } catch {
      setError('Erro ao criar personagem. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Link>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display text-xl">Novo Personagem</CardTitle>
              <CardDescription>
                Crie um novo aventureiro para sua jornada
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Personagem</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Aldric Tempestade"
                required
                className="bg-input border-border"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Raça</Label>
                <Select value={race} onValueChange={setRace} required>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Selecione uma raça" />
                  </SelectTrigger>
                  <SelectContent>
                    {RACES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Classe</Label>
                <Select value={characterClass} onValueChange={setCharacterClass} required>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Selecione uma classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="level">Nível Inicial</Label>
                <Input
                  id="level"
                  type="number"
                  min={1}
                  max={20}
                  value={level}
                  onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Antecedente (Opcional)</Label>
                <Select value={background} onValueChange={setBackground}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Selecione um antecedente" />
                  </SelectTrigger>
                  <SelectContent>
                    {BACKGROUNDS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !name || !race || !characterClass}
                className="flex-1 bg-primary text-primary-foreground"
              >
                {loading ? 'Criando...' : 'Criar Personagem'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
