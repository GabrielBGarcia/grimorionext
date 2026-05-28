import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Construction } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
          <Settings className="h-7 w-7 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">
          Personalize sua experiência
        </p>
      </div>

      <Card className="bg-card border-border border-dashed max-w-lg">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Construction className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-lg mb-2">Em Desenvolvimento</CardTitle>
          <CardDescription className="text-center">
            As configurações da conta estarão disponíveis em breve.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
