import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getCampaign, getCampaignMembers, getCampaignCharacters, isMaster } from '@/app/actions/campaigns'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Wand2, Crown, User, Plus, ArrowLeft, Swords } from 'lucide-react'
import { CopyInviteButton } from './copy-invite-button'
import { CampaignActions } from './campaign-actions'

interface PageProps { 
  params: Promise<{ id: string }> 
}

export default async function CampaignPage({ params }: PageProps) {
  const { id } = await params
  let camp
  try { 
    camp = await getCampaign(id) 
  } catch { 
    redirect('/dashboard/campaigns') 
  }
  if (!camp) notFound()

  const [members, characters, master] = await Promise.all([
    getCampaignMembers(id),
    getCampaignCharacters(id),
    isMaster(id),
  ])

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/dashboard/campaigns" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Campanhas
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
            {camp.name}
            {master && <Badge variant="default"><Crown className="h-3 w-3 mr-1" />Mestre</Badge>}
          </h1>
          {camp.description && <p className="text-muted-foreground mt-1">{camp.description}</p>}
        </div>
        <div className="flex gap-2">
          {master && (
            <Link href={`/dashboard/campaigns/${id}/homebrew`}>
              <Button variant="outline">
                <Wand2 className="h-4 w-4 mr-2" />
                Homebrew
              </Button>
            </Link>
          )}
          <Link href={`/dashboard/characters/new?campaignId=${id}`}>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Novo Personagem
            </Button>
          </Link>
          <CampaignActions campaignId={id} isMaster={master} />
        </div>
      </div>

      {/* Código de convite (só mestre vê) */}
      {master && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Código de Convite
            </CardTitle>
            <CardDescription>Compartilhe com seus jogadores para eles entrarem na campanha</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <code className="text-2xl font-mono font-bold text-primary tracking-widest bg-primary/10 px-4 py-2 rounded-lg">
              {camp.inviteCode}
            </code>
            <CopyInviteButton code={camp.inviteCode} />
          </CardContent>
        </Card>
      )}

      {/* Membros */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Membros ({members.length})
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map(m => (
            <Card key={m.id} className="bg-card border-border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                  {m.role === 'master' ? <Crown className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{m.userName}</p>
                  <Badge variant="outline" className="text-xs mt-0.5">
                    {m.role === 'master' ? 'Mestre' : 'Jogador'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Personagens da campanha */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
          <Swords className="h-5 w-5 text-primary" />
          Personagens ({characters.length})
        </h2>
        {characters.length === 0 ? (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground text-sm">Nenhum personagem nessa campanha ainda.</p>
              <Link href={`/dashboard/characters/new?campaignId=${id}`} className="mt-3">
                <Button size="sm" className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Personagem
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map(char => (
              <Link key={char.id} href={`/dashboard/characters/${char.id}`}>
                <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{char.name}</CardTitle>
                        <CardDescription>{char.race} {char.characterClass}</CardDescription>
                        <p className="text-xs text-muted-foreground mt-1">Jogador: {char.userName}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                        {char.level}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm">
                      <span>
                        <span className="text-red-400">HP </span>
                        <span className="text-muted-foreground">{char.hitPointsCurrent}/{char.hitPointsMax}</span>
                      </span>
                      <span>
                        <span className="text-blue-400">CA </span>
                        <span className="text-muted-foreground">{char.armorClass}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}