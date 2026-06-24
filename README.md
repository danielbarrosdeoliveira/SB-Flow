# SB-Flow

Sistema de Gestão para Salões de Beleza Feminino — agenda compartilhada para o Studio Blessed.

Elimina conflitos de agendamento entre proprietária e autônomas parceiras que dividem o espaço.

## Stack

```
api/                 → Fastify 5 + DrizzleORM + PostgreSQL + postgres.js
packages/landing     → Nuxt 4 + Tailwind CSS (SSR)
packages/dashboard   → Nuxt 4 + Nuxt UI + Pinia + @tanstack/vue-query (SPA)
packages/booking     → Nuxt 4 + Tailwind CSS (SPA)
infra                → Docker Compose (dev) → Oracle Cloud (prod)
```

## Arquitetura

| Camada | Pacote | Framework | Renderização | Domínio |
|--------|--------|-----------|-------------|---------|
| API | `api/` | Fastify + DrizzleORM | REST + SSE | `api.blessedstudio.com.br` |
| Landing | `packages/landing` | Nuxt 4 + Tailwind CSS | SSR | `blessedstudio.com.br` |
| Dashboard | `packages/dashboard` | Nuxt 4 + Nuxt UI | SPA | `dashboard.blessedstudio.com.br` |
| Booking | `packages/booking` | Nuxt 4 + Tailwind CSS | SPA | `booking.blessedstudio.com.br` |
| Server State | `@tanstack/vue-query` | Cache, fetching, mutations, invalidação |
| Client State | Pinia | Auth (user, role), UI flags, preferências |
| Database | PostgreSQL + Docker | Dados relacionais, prepared statements |
| Auth | JWT + cookies HttpOnly | access_token (15min) + refresh_token (30d) |

## Começando

```bash
# 1. Clone e configure
cp .env.example .env

# 2. Instale dependências
npm install

# 3. Suba o banco
docker compose up -d db

# 4. Migre e popule
npm run db:generate -w api
npm run db:migrate -w api
npm run db:seed -w api

# 5. Inicie em dev (cada um em um terminal)
npm run dev:api        # terminal 1 — http://192.168.31.202:3001
npm run dev:dashboard  # terminal 2 — http://192.168.31.202:3000
npm run dev:landing    # terminal 3 — http://192.168.31.202:3000 (use -p se ocupada)
npm run dev:booking    # terminal 4 — http://192.168.31.202:3000 (use -p se ocupada)
```

## Scripts

| Comando | Descrição |
|---------|----------|
| `npm run dev:api` | Inicia API Fastify em dev (tsx watch) — porta 3001 |
| `npm run dev:dashboard` | Inicia dashboard Nuxt — porta 3000 |
| `npm run dev:landing` | Inicia landing page Nuxt — porta 3000 (use `-p 3002` se ocupada) |
| `npm run dev:booking` | Inicia booking Nuxt — porta 3000 (use `-p 3003` se ocupada) |
| `npm run typecheck` | TypeCheck api + web |
| `npm run lint` | Biome lint + format |
| `npm run db:generate -w api` | Gera migrations Drizzle |
| `npm run db:migrate -w api` | Aplica migrations |
| `npm run db:seed -w api` | Popula conta OWNER admin |

## Documentação

- [Conventions](.specs/codebase/CONVENTIONS.md) — regras de estado, Pinia vs TanStack Query
- [Spec](.specs/features/agenda-compartilhada/spec.md) — requisitos funcionais
- [Design](.specs/features/agenda-compartilhada/design.md) — arquitetura, MER, diagramas
- [Tasks (booking)](.specs/features/agenda-compartilhada/tasks.md) — backlog agenda compartilhada
- [Tasks (dashboard)](.specs/features/dashboard/tasks.md) — backlog dashboard
- [ADRs](.specs/project/STATE.md) — decisões arquiteturais registradas
- [Architecture](.specs/project/ARCHITECTURE.md) — rotas, deploys, stack
- [Roadmap](.specs/project/ROADMAP.md) — milestones
- [Tracking](TASKS.md) — rastreamento de execução

## Projeto

Projeto pessoal. Stack escolhida por simplicidade e familiaridade (TypeScript, Vue, Fastify). Infraestrutura em Docker Compose para consistência entre dev, validação com a proprietária e deploy em produção.
