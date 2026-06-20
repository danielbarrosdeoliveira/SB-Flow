# Task Tracking

> Rastreamento de execução do projeto SB-Flow.
> Última atualização: 2026-06-20

---

## Status Geral

| Domínio | Tasks | Concluídas | % |
|---------|-------|-----------|---|
| Fundação | FOUNDATION-01 a 05 | 5/5 | 100% |
| Auth | AUTH-01 a 06 | 6/6 | 100% |
| TanStack Query | TANSTACK-01 a 04 | 3/4 | 75% |
| Partner | PARTNER-01 a 05 | 0/5 | 0% |
| Services | SERVICES-01 a 03 | 0/3 | 0% |
| Clients | CLIENTS-01 a 03 | 0/3 | 0% |
| Booking | BOOKING-01 a 12 | 0/12 | 0% |

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
- [x] Criar schema Drizzle `professionals`
- [x] Gerar migration e aplicar
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

## Execução — Fase 3 (TanStack Query) ✅

### TANSTACK-01: Plugin Vue Query com SSR hydration ✅
- [x] `@tanstack/vue-query` instalado
- [x] `web/plugins/vue-query.ts` — QueryClient isolado por requisição SSR
- [x] Dehydrate no `app:rendered` → `nuxtApp.payload.vueQuery`
- [x] Hydrate no `app:created` → restaura cache no cliente

### TANSTACK-02: Composables de domínio ✅
- [x] `web/composables/use-appointments.ts`
- [x] `web/composables/use-user-profile.ts`
- [ ] `web/composables/use-services.ts` — *pendente*
- [ ] `web/composables/use-clients.ts` — *pendente*

### TANSTACK-03: Integração com Pinia auth store ✅
- [x] `logout()` chama `queryClient.clear()`
- [x] API wrapper com refresh automático em 401
- [ ] SSE events invalidam queries — *pendente implementação SSE*

### TANSTACK-04: SSR prefetch pattern ✅
- [x] `useAsyncData` + `queryClient.prefetchQuery` em `dashboard/agenda.vue`
- [x] Plugin dehydrate/hydrate captura e restaura estado
- [ ] Aplicar nas demais páginas SSR — *pendente*

---

## Próximas Tasks

| Ordem | Task | Depende de | Status |
|-------|------|-----------|--------|
| 1 | PARTNER-01: Schema professionals completo | AUTH-01 | Pendente |
| 2 | PARTNER-02: CRUD de profissionais | PARTNER-01 | Pendente |
| 3 | SERVICES-01: Schema + CRUD serviços | AUTH-04 | Pendente |
| 4 | CLIENTS-01: Schema + CRUD clientes | AUTH-04 | Pendente |
| 5 | BOOKING-01: Schema appointments + CRUD | PARTNER-02, SERVICES-01, CLIENTS-01 | Pendente |

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
