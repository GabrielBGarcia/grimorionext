import { redirect } from 'next/navigation'
import { isMaster } from '@/app/actions/campaigns'
import { getHomebrewSpells, getHomebrewItems, getHomebrewRaces, getHomebrewClasses } from '@/app/actions/homebrew'
import { HomebrewClient } from './homebrew-client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps { 
  params: Promise<{ id: string }> 
}

export default async function HomebrewPage({ params }: PageProps) {
  const { id } = await params
  const master = await isMaster(id)
  if (!master) redirect(`/dashboard/campaigns/${id}`)

  const [spells, items, races, classes] = await Promise.all([
    getHomebrewSpells(id),
    getHomebrewItems(id),
    getHomebrewRaces(id),
    getHomebrewClasses(id),
  ])

  return (
    <div className="p-6 lg:p-8">
      <Link 
        href={`/dashboard/campaigns/${id}`} 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Campanha
      </Link>
      
      <HomebrewClient 
        campaignId={id} 
        spells={spells} 
        items={items} 
        races={races} 
        classes={classes} 
      />
    </div>
  )
}
