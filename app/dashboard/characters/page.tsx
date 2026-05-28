import { getCharacters } from '@/app/actions/characters'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'

export default async function CharactersPage() {
  const characters = await getCharacters()

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Personagens
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus aventureiros
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground">
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
          {characters.map((character) => (
            <Link key={character.id} href={`/dashboard/characters/${character.id}`}>
              <Card className="bg-card border-border hover:border-primary/50 transition-colors card-hover cursor-pointer h-full">
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
                    {character.background && (
                      <span className="text-muted-foreground">
                        {character.background}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
