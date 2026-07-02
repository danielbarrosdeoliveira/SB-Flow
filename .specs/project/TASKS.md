# Task Tracking

> Rastreamento de execução do projeto SB-Flow.
> Última atualização: 2026-07-02

---

## Status Geral

| Domínio | Tasks | Concluídas | % | Status Real |
|---------|-------|-----------|---|-------------|
| Fundação | 5 | 5/5 | 100% | ✅ |
| Auth Backend | 4 | 4/4 | 100% | ✅ |
| Auth Frontend | 2 | 2/2 | 100% | ✅ |
| TanStack Query | 4 | 4/4 | 100% | ✅ |
| Partner Backend | 3 | 3/3 | 100% | ✅ |
| Partner Frontend | 2 | 2/2 | 100% | ✅ |
| Services Backend | 2 | 2/2 | 100% | ✅ |
| Services Frontend | 1 | 1/1 | 100% | ✅ |
| Clients Backend | 2 | 2/2 | 100% | ✅ |
| Clients Frontend | 1 | 1/1 | 100% | ✅ |
| Booking Backend | 7 | 7/7 | 100% | ✅ (BOOKING-06 cancelado) |
| Booking Frontend | 2 | 0/2 | 0% | ⚠️ Placeholder |
| SSE | 1 | 1/1 | 100% | ✅ |
| Landing | 7 | 7/7 | 100% | ✅ |
| **Dashboard UI** | 14 | 2/14 | 14% | ⚠️ Em progresso |
| **TOTAL** | **57** | **43/57** | **75%** | — |

---

## Backend API — ✅ CONCLUÍDO

### Auth ✅
- [x] AUTH-01: Schema professionals (login fields)
- [x] AUTH-02: Rotas login/refresh/logout
- [x] AUTH-03: JWT plugin + middleware
- [x] AUTH-04: RBAC CASL.js
- [x] AUTH-05: Login page (frontend)
- [x] AUTH-06: Auth store + proteção de rotas

### Partner ✅
- [x] PARTNER-01: Schema extended
- [x] PARTNER-02: CRUD profissionais
- [x] PARTNER-03: CRUD bloqueios

### Services ✅
- [x] SERVICES-01: Schema services
- [x] SERVICES-02: CRUD services

### Clients ✅
- [x] CLIENTS-01: Schema clients
- [x] CLIENTS-02: CRUD clients

### Appointments + SSE ✅
- [x] BOOKING-01: Schema appointments
- [x] BOOKING-02: CRUD appointments
- [x] BOOKING-03: Transação com checagem de conflito
- [x] BOOKING-04: Cancelar e alterar status
- [x] BOOKING-05: SSE tempo real

### Booking Público ✅
- [x] BOOKING-07: Listagens públicas + criação/cancelamento
- [x] BOOKING-06: ~~Envio código WhatsApp~~ → **CANCELADO** (AD-025)

---

## Frontend — ⚠️ PARCIAL

### Landing Page ✅
- [x] LANDING-01: Nuxt 4 app dir + novos serviços
- [x] LANDING-02: Monorepo split (packages)
- [x] LANDING-03: Carrossel infinito
- [x] LANDING-04: Social proof stats
- [x] LANDING-05: Autor alinhado + fotos
- [x] LANDING-06: Dependencies update
- [x] LANDING-07: Docker cleanup

### Dashboard ⚠️ PLACEHOLDER

O dashboard existe com DDD structure (`features/` + `shared/`) mas todas as páginas são placeholders "Em construção".

**Estrutura criada:**
```
packages/dashboard/app/
├── features/
│   ├── auth/          # stores, middleware, pages/login ✅
│   ├── clients/       # composables ✅ (empty)
│   ├── appointments/  # composables ✅ (empty)
│   ├── treatments/    # composables ✅ (empty)
│   ├── professionals/  # pages ✅ (empty)
│   └── dashboard/      # layouts ✅ (empty), pages ✅ (placeholder)
└── shared/
    ├── composables/   # use-sse ✅, use-user-profile ✅
    ├── stores/         # layout ✅
    ├── utils/          # api ✅, phone ✅
    └── plugins/        # vue-query ✅
```

**Tasks pendentes em `.specs/features/dashboard/tasks.md`**

### Booking ⚠️ PLACEHOLDER

`packages/booking/app/pages/index.vue` existe mas é placeholder.

**Pendente:**
- [ ] Fluxo multi-step: profissional → serviço → data/hora → confirmar
- [ ] "Meus Agendamentos": cliente consulta/cancela por telefone

---

## Prioridade de Execução

```
1. DASHBOARD-03: Layout com sidebar + navegação
   ↓
2. DASHBOARD-04: Dashboard index com KPIs reais
   ↓
3. Booking: Fluxo multi-step (/agendar)
   ↓
4. T1-T12: DDD Restructuring (migração completa)
   ↓
5. Dashboard pages: agenda, clientes, profissionais, servicos
   ↓
6. Meus Agendamentos (cliente)
```

---

## Commits Registrados

Os últimos commits do projeto (do mais recente ao mais antigo):

```
963c398 — alinhar autor ao final do card e adicionar fotos aos depoimentos
11110a4 — fix(landing): update social proof stats and lint formatting
c09c374 — fix(landing): infinite testimonials carousel, no blank slides
b5d73d3 — feat(landing): migrate to Nuxt 4 app dir, add services, fix icons
373d119 — refactor: split monorepo into packages/landing and packages/dashboard
7516186 — fix(dashboard): scope Tailwind Preflight to .tw-scope
b892d63 — feat: landing page, dashboard Vuetify, isolamento CSS híbrido
ac3af19 — feat: BOOKING-07 frontend multi-step de autoatendimento
549b14a — feat: BOOKING-07 backend API pública de booking
304d3fa — feat: BOOKING-05 SSE broadcasts
728da31 — feat: BOOKING-05 SSE gerenciador de conexões
c499ecf — feat: PARTNER-05 bloqueios de agenda
46bc6be — feat: TANSTACK-02 composables use-services e use-clients
a45f1a2 — feat: BOOKING-01/02/03/04 schema + CRUD + conflito
7b8f6ae — feat: SERVICES-01/02 + CLIENTS-01/02 schemas e CRUD
6d46b28 — feat: PARTNER-03 CRUD bloqueios de agenda
ef7e777 — feat: PARTNER-02 CRUD profissionais
61c58ba — feat: TanStack Query plugin SSR, composables, auth store
36e4d4e — feat: auth completo backend login JWT + CASL, frontend
f44843e — feat: fundação — monorepo, docker, fastify, nuxt, drizzle + seed
```