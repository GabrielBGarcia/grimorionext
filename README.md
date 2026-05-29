# 📖 Grimório

Plataforma de gerenciamento de campanhas e personagens para **D&D 5e**. Crie campanhas, convide jogadores, gerencie fichas de personagem e acompanhe tudo em tempo real.

## ✨ Funcionalidades

- **Campanhas** — crie, gerencie e convide jogadores via código de convite
- **Fichas de personagem** — atributos, HP, CA, perícias, testes de resistência
- **Inventário** — itens com quantidade, peso, categoria e equipamento
- **Magias** — magias conhecidas, preparadas e slots por nível
- **Descansos** — curto e longo com recuperação automática de HP e slots
- **Salvamentos de morte** — rastreamento de sucessos e falhas
- **Homebrew** — magias, itens, raças e classes customizadas por campanha
- **Multi-jogador** — mestre e jogadores com roles separados

## 🛠 Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind 4 + shadcn/ui |
| Banco de dados | PostgreSQL + Drizzle ORM |
| Autenticação | Better Auth |
| Deploy | Vercel |

## 🚀 Rodando localmente

### 1. Clone o repositório

```bash
git clone https://github.com/GabrielBGarcia/grimorionext.git
cd grimorionext
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/grimorio?sslmode=verify-full
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=uma-string-longa-e-aleatoria-aqui
```

> **Dica:** Para o banco de dados, você pode usar o [Neon](https://neon.tech) gratuitamente — crie um projeto e cole a connection string no `DATABASE_URL`.

### 4. Crie as tabelas no banco

```bash
npx drizzle-kit push
```

### 5. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## 📁 Estrutura do projeto

```
app/
├── actions/          # Server Actions (characters, campaigns, inventory...)
├── dashboard/        # Páginas autenticadas
│   ├── characters/   # Fichas de personagem
│   └── campaigns/    # Campanhas
└── (auth)/           # Páginas de login e cadastro

lib/
├── auth.ts           # Configuração do Better Auth
└── db/
    ├── index.ts      # Conexão com o banco
    └── schema.ts     # Tabelas e relações (Drizzle)
```

## 🗄 Banco de dados

O schema inclui 11 tabelas: `character`, `inventory_item`, `campaign`, `campaign_member`, `homebrew_spell`, `homebrew_item`, `homebrew_race`, `homebrew_class`, além das tabelas de autenticação do Better Auth.

Para visualizar e editar o banco via interface:

```bash
npx drizzle-kit studio
```

## 📜 Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Inicia o build de produção
npm run lint     # Verifica o código com ESLint
```