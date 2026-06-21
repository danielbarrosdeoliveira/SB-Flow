# Task Tracking

> Rastreamento de execução do projeto SB-Flow.
> Última atualização: 2026-06-20

---

## Status Geral

| Domínio | Tasks | Concluídas | % |
|---------|-------|-----------|---|
| Fundação | FOUNDATION-01 a 05 | 5/5 | 100% |
| Auth | AUTH-01 a 06 | 6/6 | 100% |
| TanStack Query | TANSTACK-01 a 04 | 4/4 | 100% |
| Partner (backend) | PARTNER-01 a 03 | 3/3 | 100% |
| Partner (frontend) | PARTNER-04 a 05 | 2/2 | 100% |
| Services | SERVICES-01 a 03 | 3/3 | 100% |
| Clients | CLIENTS-01 a 03 | 3/3 | 100% |
| Booking | BOOKING-01 a 14 | 5/14 | 36% |

---

## Execução — Fase 1 (Fundação) ✅

### FOUNDATION-01: Inicializar monorepo ✅
- [x] Criar estrutura `api/` + `web/` na raiz
- [x] Configurar `package.json` raiz com scripts compartilhados
- [x] Configurar `tsconfig.json` raiz com paths
- [x] Configurar `.gitignore`, `.env.example`
- [x] Configurar Biome na raiz (lint + format) com scripts
- [x] Validar compilação em ambos subprojetos

### FOUNDATION-02: Configurar Docker Compose ✅
- [x] Criar `docker-compose.yml` com 4 serviços
- [x] Criar `Dockerfile` para `api/`
- [x] Criar `Dockerfile` para `web/`
- [x] Configurar redes, volumes e variáveis de ambiente
- [x] Validar `docker-compose up` sobe todos os containers

### FOUNDATION-03: Esqueleto Fastify ✅
- [x] Inicializar `api/package.json` com dependências
- [x] Criar entry point (`api/src/index.ts`)
- [x] Configurar plugins globais (CORS, Cookie, Logger)
- [x] Implementar error handler global
- [x] Adicionar health check `GET /api/health`
- [x] Configurar variáveis de ambiente com Zod

### FOUNDATION-04: Esqueleto Nuxt ✅
- [x] Inicializar `web/package.json`
- [x] Configurar Nuxt 3 com SSR + routeRules
- [x] Configurar runtimeConfig (API URL)

### FOUNDATION-05: Schema + Migrations + Seed ✅
- [x] Criar schema Drizzle `professionals` (com workHoursStart/workHoursEnd)
- [x] Criar schema Drizzle `blocks`
- [x] Gerar migrations e aplicar
- [x] Criar script de seed com conta OWNER admin
- [x] Rodar seed e validar no banco

---

## Execução — Fase 2 (Auth) ✅

### AUTH-01: Schema de professionals (auth) ✅
- [x] Tabela `professionals` com id, name, cpf, phone, passwordHash, role, isActive, createdAt, updatedAt
- [x] Zod schemas de validação (telefone com normalize)
- [x] Migration gerada e aplicada
- [x] Índices únicos em cpf e phone

### AUTH-02: Rotas de autenticação ✅
- [x] Módulo Fastify `api/src/modules/auth/` (routes + service + schema)
- [x] `POST /api/auth/login` — telefone normalizado + bcrypt + JWT
- [x] `POST /api/auth/refresh` — refresh_token + novos tokens
- [x] `POST /api/auth/logout` — limpa cookies
- [x] Cookies HttpOnly, SameSite=Lax, Secure (prod)
- [x] Testado: login (200 + user), refresh (200 + cookies), logout (200 + clear), credenciais inválidas (401)

### AUTH-03: JWT plugin + middlewares ✅
- [x] Plugin Fastify que decodifica JWT do cookie `access_token`
- [x] `request.user` injetado com `{ professionalId, role }`
- [x] Middleware `requireAuth` — 401 se não autenticado
- [x] Middleware `requireRole('OWNER')` — 403 se negado
- [x] Middleware `requireRole('OWNER', 'PARTNER')`

### AUTH-04: RBAC com CASL.js ✅
- [x] `@casl/ability` instalado
- [x] Fábrica `createAbility(role, professionalId)` em `api/src/lib/ability.ts`
- [x] OWNER: `can('manage', 'all')`
- [x] PARTNER: permissões granulares

### AUTH-05: Tela de login ✅
- [x] Página `/login` com formulário (telefone + senha)
- [x] Utility `web/utils/phone.ts` (mask, unmask, normalize)
- [x] Validação com Zod
- [x] Erro genérico para credenciais inválidas
- [x] Redireciona para `/dashboard/agenda` após login

### AUTH-06: Store de auth + proteção de rotas ✅
- [x] Store Pinia `auth` (`user`, `isAuthenticated`, `role`, `login()`, `logout()`, `refreshToken()`)
- [x] Refresh automático em 401 (embutido em `web/utils/api.ts`)
- [x] Middleware global `auth` — redireciona para `/login`
- [x] Wrapper API `web/utils/api.ts`

---

## Execução — Fase 3 (TanStack Query) 🟡

### TANSTACK-01: Plugin Vue Query com SSR hydration ✅
- [x] `@tanstack/vue-query` instalado
- [x] `web/plugins/vue-query.ts` — QueryClient isolado por requisição SSR
- [x] Dehydrate no `app:rendered` → `nuxtApp.payload.vueQuery`
- [x] Hydrate no `app:created` → restaura cache no cliente

### TANSTACK-02: Composables de domínio ✅
- [x] `web/composables/use-appointments.ts`
- [x] `web/composables/use-user-profile.ts`
- [x] `web/composables/use-services.ts`
- [x] `web/composables/use-clients.ts`

### TANSTACK-03: Integração com Pinia auth store ✅
- [x] `logout()` chama `queryClient.clear()`
- [x] API wrapper com refresh automático em 401
- [ ] SSE events invalidam queries — *pendente implementação SSE*

### TANSTACK-04: SSR prefetch pattern ✅
- [x] `useAsyncData` + `queryClient.prefetchQuery` em `dashboard/agenda.vue`
- [x] Plugin dehydrate/hydrate captura e restaura estado
- [ ] Aplicar nas demais páginas SSR — *pendente*

---

## Execução — Fase 4 (Partner Backend) ✅

### PARTNER-01: Schema professionals completo ✅
- [x] Schema já inclui `workHoursStart` (08:00) e `workHoursEnd` (20:00) com defaults
- [x] Migration 0000 já aplicada com esses campos

### PARTNER-02: CRUD de profissionais ✅
- [x] Módulo `api/src/modules/partner/` (routes + service + schema)
- [x] `GET /api/professionals` — OWNER: todas; PARTNER: só própria
- [x] `GET /api/professionals/:id` — com RBAC
- [x] `POST /api/professionals` — OWNER only, valida CPF + telefone
- [x] `PUT /api/professionals/:id` — OWNER: qualquer campo; PARTNER: só nome/phone/workHours
- [x] `PATCH /api/professionals/:id/toggle-active` — OWNER only
- [x] Validação de CPF (dígitos verificadores) e telefone (normalize)

### PARTNER-03: CRUD de bloqueios de agenda ✅
- [x] Tabela `blocks` no Drizzle (migration 0001)
- [x] Módulo `api/src/modules/partner/blocks/` (routes + service + schema)
- [x] `GET /api/blocks` — filtro por professional_id, start, end
- [x] `POST /api/blocks` — OWNER: qualquer; PARTNER: só próprio
- [x] `DELETE /api/blocks/:id`
- [x] Atalho "dia inteiro" (00:00-23:45)
- [x] **EDGE-02**: overlap com block existente → warning
- [x] **EDGE-03 (parcial)**: estrutura preparada para appointments check

---

## Execução — Fase 5 (Partner Frontend) ⬜

### PARTNER-04: Tela de gestão de profissionais ✅
- [x] Criar página `/dashboard/profissionais` (OWNER only)
- [x] Listar profissionais com status (ativo/inativo)
- [x] Modal de criação
- [x] Modal de edição
- [x] Botão ativar/desativar

### PARTNER-05: Bloqueios de agenda ✅
- [x] Formulário de bloqueio (data, hora, "dia inteiro", razão) na agenda
- [x] Seletor de profissional (OWNER) ou auto-associação (PARTNER)
- [x] Listagem de bloqueios por data com indicação visual (borda vermelha)
- [x] Remoção de bloqueio com confirmação
- [x] Overlapping warning conforme EDGE-02

---

## Execução — Fase 6 (Services) ✅

### SERVICES-01: Schema de services ✅
- [x] Criar tabela `services` no Drizzle

### SERVICES-02: CRUD de serviços ✅
- [x] Módulo `api/src/modules/services/` (routes + service + schema)
- [x] `GET /api/services`, `POST`, `PUT`, `DELETE`

### SERVICES-03: Frontend ✅
- [x] Página `/dashboard/servicos`

---

## Execução — Fase 7 (Clients) ✅

### CLIENTS-01: Schema de clients ✅
- [x] Criar tabela `clients` no Drizzle

### CLIENTS-02: CRUD de clientes ✅
- [x] Módulo `api/src/modules/clients/` (routes + service + schema)

### CLIENTS-03: Frontend ✅
- [x] Página `/dashboard/clientes`

---

## Execução — Fase 8 (Booking) 🟡

### BOOKING-01: Schema appointments + CRUD ✅
- [x] Tabela `appointments` no Drizzle
- [x] CRUD completo (GET / POST / PUT / DELETE)

### BOOKING-02: Transação com checagem de conflito ✅
- [x] `db.transaction()` com SELECT de verificação antes do INSERT
- [x] 409 Conflict se horário já ocupado

### BOOKING-03: Cancelar e alterar status ✅
- [x] Rota PATCH `/api/appointments/:id/status`
- [x] Validação de transições de status

### BOOKING-04: Agendamentos listados no dashboard ✅
- [x] Página `/dashboard/agenda` com appointments do dia

### BOOKING-05: SSE (tempo real) ✅
- [x] Gerenciador de conexões SSE no backend (`api/src/lib/sse-manager.ts`)
- [x] Endpoint `/api/sse` autenticado via cookie com heartbeat
- [x] Broadcast em appointments: create, update, cancel, status-changed
- [x] Broadcast em blocks: created, deleted
- [x] OWNER recebe eventos de todos os profissionais
- [x] Composable `useSSE` no frontend com reconexão automática
- [x] Agenda page conecta SSE e invalida queries em tempo real

### BOOKING-06 a BOOKING-14 ⬜
- [ ] Envio/verificação código WhatsApp
- [ ] Listagens públicas booking
- [ ] Criação/cancelamento pelo cliente
- [ ] Landing page (SSR)
- [ ] Store de booking
- [ ] Fluxo autoatendimento (multi-step)
- [ ] Meus agendamentos (cliente)
- [ ] Calendário do dashboard
- [ ] Páginas do dashboard

---

## Próximas Tasks

| Ordem | Task | Depende de | Status |
|-------|------|-----------|--------|
| 1 | TANSTACK-02: `use-services.ts` + `use-clients.ts` | — | ✅ Concluído |
| 2 | PARTNER-05: Frontend bloqueios | PARTNER-03 | ✅ Concluído |
| 3 | BOOKING-05: SSE (tempo real) | BOOKING-04 | ✅ Concluído |

---

## Commits

```
61c58ba 🔋 feat: TanStack Query — plugin SSR, composables, auth store integrado
36e4d4e 🔒 feat: auth completo — backend login JWT + CASL RBAC, frontend login + Pinia + middleware
a3f9d6b 🐛 fix: env vars seed opcionais e --env-file no dev
a8e01b1 🔧 chore: .env.example com seed vars seguras
f44843e 🎉 feat: fundação — monorepo, docker, fastify, nuxt, drizzle + seed
ea22ddd 📝 docs: spec, design, tasks e ADRs do projeto
```
