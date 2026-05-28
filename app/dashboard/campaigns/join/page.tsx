'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { joinCampaign } from '@/app/actions/campaigns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function JoinCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [code, setCode] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) {
      setError('Digite o código de convite')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await joinCampaign(code.trim())
      setSuccess(`Você entrou na campanha "${result.name}"!`)
      setTimeout(() => {
        router.push(`/dashboard/campaigns/${result.campaignId}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar na campanha')
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <Link 
        href="/dashboard/campaigns" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Campanhas
      </Link>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Entrar em Campanha</CardTitle>
              <CardDescription>
                Use o código de convite do seu mestre
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Convite</Label>
              <Input
                id="code"
                placeholder="Ex: ABC123"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={loading || !!success}
                className="text-center text-2xl font-mono tracking-widest uppercase"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                O código tem 6 caracteres e não diferencia maiúsculas de minúsculas
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-500">{success}</p>
            )}

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={loading || !!success}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-primary text-primary-foreground"
                disabled={loading || !code.trim() || !!success}
              >
                {loading ? 'Entrando...' : 'Entrar na Campanha'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/30 border-border mt-6">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Dica:</strong> Peça ao mestre da mesa o código 
            de convite da campanha. Ele pode ser encontrado na página da campanha do mestre.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
