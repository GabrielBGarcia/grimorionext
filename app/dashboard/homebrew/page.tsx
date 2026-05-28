import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wand2, Construction } from 'lucide-react'
import Link from 'next/link'

export default function HomebrewPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
          <Wand2 className="h-7 w-7 text-primary" />
          Homebrew
        </h1>
        <p className="text-muted-foreground mt-1">
          Crie magias e itens personalizados
        </p>
      </div>

      <Card className="bg-card border-border border-dashed max-w-lg">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Construction className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg mb-2">Em Desenvolvimento</CardTitle>
          <CardDescription className="text-center mb-4">
            O editor de homebrew está sendo construído. 
            Em breve você poderá criar suas próprias magias e itens personalizados.
          </CardDescription>
          <Button asChild variant="outline">
            <Link href="/dashboard/spells">
              Ver Grimório
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
