import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { characters } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { Package, ChevronRight, User, Coins, Weight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function InventoryPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) redirect('/login')

  const userCharacters = await db.query.characters.findMany({
    where: eq(characters.userId, session.user.id),
    with: {
      inventory: true,
    },
    orderBy: (chars, { desc }) => [desc(chars.updatedAt)],
  })

  const formatCurrency = (char: typeof userCharacters[0]) => {
    const parts = []
    if (char.pp && char.pp > 0) parts.push(`${char.pp} PP`)
    if (char.gp && char.gp > 0) parts.push(`${char.gp} PO`)
    if (char.ep && char.ep > 0) parts.push(`${char.ep} PE`)
    if (char.sp && char.sp > 0) parts.push(`${char.sp} PP`)
    if (char.cp && char.cp > 0) parts.push(`${char.cp} PC`)
    return parts.length > 0 ? parts.join(', ') : 'Sem dinheiro'
  }

  const getTotalWeight = (char: typeof userCharacters[0]) => {
    return char.inventory.reduce((acc, item) => {
      return acc + (item.weight ?? 0) * (item.quantity ?? 1)
    }, 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Package className="h-7 w-7 text-primary" />
          Inventário
        </h1>
        <p className="text-muted-foreground">
          Gerencie os itens e equipamentos dos seus personagens
        </p>
      </div>

      {userCharacters.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum personagem encontrado
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Crie um personagem para começar a gerenciar seu inventário.
            </p>
            <Button asChild>
              <Link href="/dashboard/characters/new">Criar Personagem</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userCharacters.map((char) => (
            <Link key={char.id} href={`/dashboard/characters/${char.id}?tab=inventory`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {char.name}
                    </CardTitle>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {char.race} {char.class} Nível {char.level}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {char.inventory.length} {char.inventory.length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="h-4 w-4 text-amber-500" />
                    <span className="text-foreground">{formatCurrency(char)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {getTotalWeight(char).toFixed(1)} kg carregados
                    </span>
                  </div>

                  {char.inventory.filter(i => i.isEquipped).length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {char.inventory
                        .filter(i => i.isEquipped)
                        .slice(0, 3)
                        .map(item => (
                          <Badge key={item.id} variant="secondary" className="text-xs">
                            {item.name}
                          </Badge>
                        ))}
                      {char.inventory.filter(i => i.isEquipped).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{char.inventory.filter(i => i.isEquipped).length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
