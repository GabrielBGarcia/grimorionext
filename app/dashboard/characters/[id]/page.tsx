import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCharacter } from '@/app/actions/characters'
import { ArrowLeft } from 'lucide-react'
import { CharacterSheet } from './character-sheet'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params
  const character = await getCharacter(id)
  
  if (!character) {
    notFound()
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <Link
          href="/dashboard/characters"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Personagens
        </Link>
      </div>

      <CharacterSheet character={character} />
    </div>
  )
}
