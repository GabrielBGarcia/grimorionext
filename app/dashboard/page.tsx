import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getCharacters } from '@/app/actions/characters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, Plus, Sparkles, Wand2 } from 'lucide-react'
import { SRD_SPELLS } from '@/lib/data/spells'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const characters = await getCharacters()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Olá, {session?.user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo ao seu grimório de aventuras
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personagens
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{characters.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {characters.length === 1 ? 'aventureiro ativo' : 'aventureiros ativos'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Magias SRD
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{SRD_SPELLS.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              magias disponíveis
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Homebrew
            </CardTitle>
            <Wand2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              criações personalizadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nível Máximo
            </CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {characters.length > 0 
                ? Math.max(...characters.map(c => c.level))
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              entre seus personagens
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Characters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Seus Personagens
          </h2>
          <Button asChild size="sm" className="bg-primary text-primary-foreground">
            <Link href="/dashboard/characters/new">
              <Plus className="h-4 w-4 mr-2" />
              Novo Personagem
            </Link>
          </Button>
        </div>

        {characters.length === 0 ? (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg mb-2">Nenhum personagem ainda</CardTitle>
              <CardDescription className="text-center mb-4">
                Crie seu primeiro personagem para começar sua aventura
              </CardDescription>
              <Button asChild className="bg-primary text-primary-foreground">
                <Link href="/dashboard/characters/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Personagem
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {characters.slice(0, 6).map((character) => (
              <Link key={character.id} href={`/dashboard/characters/${character.id}`}>
                <Card className="bg-card border-border hover:border-primary/50 transition-colors card-hover cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-foreground">
                          {character.name}
                        </CardTitle>
                        <CardDescription>
                          {character.race} {character.characterClass}
                        </CardDescription>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                        {character.level}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-red-400">HP</span>
                        <span className="text-muted-foreground">
                          {character.hitPointsCurrent}/{character.hitPointsMax}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-400">CA</span>
                        <span className="text-muted-foreground">
                          {character.armorClass}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/spells">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors card-hover cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Grimório de Magias</CardTitle>
                  <CardDescription>Explore todas as magias disponíveis</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/homebrew">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors card-hover cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Wand2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Criar Homebrew</CardTitle>
                  <CardDescription>Crie magias e itens personalizados</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/characters/new">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors card-hover cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Novo Personagem</CardTitle>
                  <CardDescription>Comece uma nova aventura</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
