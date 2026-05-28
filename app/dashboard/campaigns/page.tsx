import Link from 'next/link'
import { getMyCampaigns } from '@/app/actions/campaigns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, Crown, User, LogIn } from 'lucide-react'

export default async function CampaignsPage() {
  const campaigns = await getMyCampaigns()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Campanhas</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas aventuras e mesas de jogo</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/campaigns/join">
            <Button variant="outline">
              <LogIn className="h-4 w-4 mr-2" />
              Entrar em Campanha
            </Button>
          </Link>
          <Link href="/dashboard/campaigns/new">
            <Button className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </Link>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-lg mb-2">Nenhuma campanha ainda</CardTitle>
            <CardDescription className="text-center mb-6 max-w-sm">
              Crie uma campanha como mestre ou entre em uma campanha existente com um código de convite.
            </CardDescription>
            <div className="flex gap-3">
              <Link href="/dashboard/campaigns/join">
                <Button variant="outline">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar com Código
                </Button>
              </Link>
              <Link href="/dashboard/campaigns/new">
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Campanha
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((camp) => (
            <Link key={camp!.id} href={`/dashboard/campaigns/${camp!.id}`}>
              <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-foreground truncate">{camp!.name}</CardTitle>
                      {camp!.description && (
                        <CardDescription className="line-clamp-2 mt-1">
                          {camp!.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Badge 
                        variant={camp!.role === 'master' ? 'default' : 'secondary'}
                        className="shrink-0"
                      >
                        {camp!.role === 'master' ? (
                          <><Crown className="h-3 w-3 mr-1" />Mestre</>
                        ) : (
                          <><User className="h-3 w-3 mr-1" />Jogador</>
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Clique para ver detalhes</span>
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
