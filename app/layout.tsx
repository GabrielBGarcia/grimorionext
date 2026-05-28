import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Meu RPG',
  description: 'Gerenciador de Campanhas e Personagens',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}