# SB-Flow

Sistema de Gestão para Salões de Beleza Feminino — agenda compartilhada para o Studio Blessed.

Elimina conflitos de agendamento entre proprietária e autônomas parceiras que dividem o espaço.

## Stack

```
api/   → Fastify 5 + DrizzleORM + PostgreSQL + postgres.js
web/   → Nuxt 3 + Pinia + @tanstack/vue-query + Vuetify + TailwindCSS
infra  → Docker Compose (dev) → Oracle Cloud (prod)
```

## Arquitetura

| Camada | Tecnologia | Responsabilidade |
|--------|-----------|-----------------|
| API | Fastify + DrizzleORM | REST, JWT (cookies HttpOnly), SSE, CASL RBAC |
| Frontend | Nuxt 3 + routeRules | SSR (landing) + SPA (dashboard) |
| Server State | `@tanstack/vue-query` | Cache, fetching, SSR dehydrate/hydrate |
| Client State | Pinia | Auth (user, role), UI flags |
| Database | PostgreSQL + Docker | Dados relacionais, prepared statements |
| Auth | JWT + cookies HttpOnly | access_token (15min) + refresh_token (30d) |

## Começando

```bash
# 1. Clone e configure
cp .env.example .env    # edite as variáveis sensíveis

# 2. Instale dependências
npm install
cd api && npm install && cd ..
cd web && npm install && cd ..

# 3. Suba o banco
docker compose up -d db

# 4. Migre e popule
npm run db:generate -w api
npm run db:migrate -w api
npm run db:seed -w api

# 5. Inicie em dev
npm run dev:api    # terminal 1 — http://localhost:3001
npm run dev:web    # terminal 2 — http://localhost:3000
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev:api` | Inicia Fastify em dev (tsx watch) |
| `npm run dev:web` | Inicia Nuxt em dev |
| `npm run typecheck` | TypeCheck api + web |
| `npm run lint` | Biome lint + format |
| `npm run db:generate -w api` | Gera migrations Drizzle |
| `npm run db:migrate -w api` | Aplica migrations |
| `npm run db:seed -w api` | Popula conta OWNER admin |

## Documentação

- [Spec]`.specs/features/agenda-compartilhada/spec.md` — requisitos funcionais
- [Design]`.specs/features/agenda-compartilhada/design.md` — arquitetura, MER, diagramas
- [Tasks]`.specs/features/agenda-compartilhada/tasks.md` — backlog por domínio
- [ADRs]`.specs/project/STATE.md` — arquiteturais registradas
- [Roadmap]`.specs/project/ROADMAP.md` — milestones
- [Tracking]`TASKS.md` — rastreamento de execução

## Projeto

Projeto pessoal. Stack escolhida por simplicidade e familiaridade (TypeScript, Vue, Fastify). Infraestrutura em Docker Compose para consistência entre dev, validação com a proprietária e deploy em produção.
