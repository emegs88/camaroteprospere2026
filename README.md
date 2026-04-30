# 🤠 Camarote Prospere — Festa do Peão Hortolândia 2026

Sistema web completo de gerenciamento de camarotes e convites digitais da **Prospere Consórcio**, Patrocinador Master da Festa do Peão de Hortolândia 2026.

## Funcionalidades

- **Dashboard** com gráficos de ocupação e distribuição por tipo
- **Gestão de Pessoas** — 6 tipos: Influencer, Cliente, Parceiro, VIP, Colaborador, Imprensa
- **Mapa Visual** de ingressos por categoria (Backstage, Imóveis, Futsal)
- **Convite Digital** com QR Code, download PNG e compartilhamento via WhatsApp
- **CRM básico** para clientes com histórico de interações
- **Painel de Influencers** com rastreamento de posts
- **Shows** — cadastro e associação de ingressos
- **Exportação CSV** por tipo de convidado
- **Autenticação** com NextAuth.js

## Estrutura de Ingressos

| Categoria | Qtd |
|-----------|-----|
| Prospere Consórcio Backstage | 50 ingressos |
| Prospere Imóveis (camarotes) | 10 ingressos |
| Prospere Hortolândia Futsal (camarotes) | 10 ingressos |
| **Total** | **70** |

## Pré-requisitos

- Node.js 18+
- npm

## Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.example .env

# 3. Rodar migrações do banco
npx prisma migrate dev

# 4. Popular banco com dados de exemplo
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# 5. Gerar Prisma Client
npx prisma generate

# 6. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

## Credenciais Padrão

```
Email: admin@prospere.com.br
Senha: prospere2026
```

## Stack Técnica

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** API Routes do Next.js
- **Banco de dados:** SQLite com Prisma ORM 7
- **Autenticação:** NextAuth.js v4
- **QR Code:** qrcode
- **Convite visual:** html2canvas
- **Gráficos:** Recharts
- **Ícones:** Lucide React

## Identidade Visual

- Preto `#1a1a1a` · Dourado `#c9a84c` · Verde Escuro `#2d6a4f`
- Fonte: Barlow (Google Fonts)

## Estrutura de Pastas

```
app/
  page.tsx              # Dashboard
  login/page.tsx        # Login
  pessoas/page.tsx      # Gestão de pessoas (6 sub-abas)
  backstage/page.tsx    # 50 ingressos backstage
  imoveis/page.tsx      # 10 camarotes imóveis
  futsal/page.tsx       # 10 camarotes futsal
  shows/page.tsx        # Gerenciamento de shows
  convite/[token]/      # Convite público com QR Code
  configuracoes/page.tsx # Exportação CSV e configurações
  api/
    auth/[...nextauth]/ # NextAuth
    convidados/         # CRUD convidados
    ingressos/          # CRUD ingressos
    shows/              # CRUD shows
    dashboard/          # Métricas do dashboard
components/
  Sidebar.tsx
  AppLayout.tsx
  BadgeTipo.tsx
  Modal.tsx
  FormConvidado.tsx
  GridIngressos.tsx
lib/
  prisma.ts             # Cliente Prisma
prisma/
  schema.prisma         # Schema do banco
  seed.ts               # Dados de exemplo
  dev.db                # Banco SQLite (gerado)
```

---

© 2026 Prospere Consórcio · Patrocinador Master · Hortolândia, SP
