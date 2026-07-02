# SB-Flow — Roadmap

**Última atualização:** 2026-07-02
**Status real verificado no código fonte**

---

## Fase 1: Desenvolvimento Local

### ✅ Milestone 1: Fundação

- [x] Monorepo, Docker Compose, Fastify, Drizzle, PostgreSQL
- [x] Autenticação (JWT + CASL RBAC)
- [x] TanStack Query + SSR hydration
- [x] Seed (OWNER admin)

### ✅ Milestone 2: Backend API

- [x] Auth (login/refresh/logout)
- [x] Professionals + Blocks CRUD
- [x] Services CRUD
- [x] Clients CRUD
- [x] Appointments CRUD + Transação de conflito
- [x] SSE (tempo real)
- [x] Booking público (criação + cancelamento)

### ✅ Milestone 3: Landing Page

- [x] 11 seções SSR com Tailwind CSS
- [x] Carrossel infinito de depoimentos
- [x] Fotos e alinhamento de autor
- [x] Nuxt 4 app directory

### ⚠️ Milestone 4: Dashboard (EM ANDAMENTO)

**Estrutura DDD criada.** Todas as páginas são placeholders.

**Feito:**
- [x] DDD structure (`features/` + `shared/`)
- [x] Auth flow completo
- [x] TanStack Query setup
- [x] Nuxt UI v4 configurado
- [x] Layout com sidebar + navegação (DASHBOARD-03) — 20 testes

**Pendente:**
- [ ] Dashboard index com KPIs reais (DASHBOARD-04)
- [ ] Dashboard index com KPIs reais (DASHBOARD-04)
- [ ] `/dashboard/agenda` — calendário funcional
- [ ] `/dashboard/clientes` — CRUD
- [ ] `/dashboard/profissionais` — CRUD
- [ ] `/dashboard/servicos` — CRUD
- [ ] T1-T12: DDD Restructuring

### ⚠️ Milestone 5: Booking (EM ANDAMENTO)

**Backend API pronta. Frontend incompleto.**

**Feito:**
- [x] API pública (`/api/booking/*`)

**Pendente:**
- [ ] Fluxo multi-step (`/agendar`)
- [ ] "Meus Agendamentos" para cliente

---

## Fase 2: Validação e Deploy

### Milestone 6: Validação com a Proprietária

- [ ] Testes end-to-end com usuária real
- [ ] Ajustes baseados no feedback

**Pré-requisito:** Milestones 4 e 5 completas

### Milestone 7: Deploy

- [ ] Oracle Cloud VPS provisioning
- [ ] Docker Compose na VPS
- [ ] GitHub Actions
- [ ] Domínio + SSL
- [ ] Deploy produção

**Pré-requisito:** Milestone 6 completa

---

## v2 (Pós-deploy)

- Notificações internas (dashboard badge)
- Histórico de agendamentos
- Status avançado de agendamento
- Bot WhatsApp (EvolutionAPI)

## v3

- Relatórios
- Auto-lock por inatividade
- Controle de estoque
- Google Calendar integration