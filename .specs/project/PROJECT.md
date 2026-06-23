# SB-Flow — Sistema de Gestão para Salões de Beleza Feminino

**Vision:** Sistema de gestão de agenda compartilhada para o Studio Blessed, onde a proprietária e as autônomas parceiras que alugam espaço visualizam a agenda umas das outras sem acesso a valores financeiros alheios, eliminando conflitos de agendamento.

**For:** Proprietárias de salão e profissionais autônomas que alugam espaço, inicialmente o Studio Blessed.

**Solves:** Conflitos de agendamento no Studio Blessed — a proprietária gerencia os agendamentos de todas as profissionais, mas sem uma visão unificada, ocorrem sobreposições e desencontros.

## Goals

- Eliminar conflitos de agendamento entre a proprietária e as autônomas parceiras que compartilham o espaço
- Permitir que a proprietária do salão veja e gerencie a agenda de todas as profissionais
- Cada autônoma parceira gerencia apenas a própria agenda, mas vê os horários ocupados das demais para evitar conflitos
- Cada autônoma parceira vê apenas seus próprios valores financeiros
- Fornecer à proprietária visão consolidada financeira e de agendamentos de todo o salão

## Tech Stack

**Core:**
- Frontend: Nuxt 4 + TailwindCSS + Nuxt UI
- Backend: Fastify
- Database: PostgreSQL (Docker)
- ORM: DrizzleORM

**Key dependencies:**
- TypeScript (todo o projeto)
- Nuxt 4 (framework fullstack, gerencia SSR + SPA via routeRules)
- @nuxt/ui (biblioteca de componentes oficial do ecossistema Nuxt)
- @nuxtjs/tailwindcss (landing page)
- Pinia (Client State — auth, UI flags)
- @tanstack/vue-query (Server State — appointments, professionals, services, clients)
- Zod (validação compartilhada)
- Biome (lint/format)
- Day.js (manipulação de datas para agenda)
- CASL.js (RBAC)
- postgres.js (driver de banco, `prepare: true`)
- SSE (tempo real no dashboard)
- @fastify/cookie (cookies HTTP-Only para auth + SSE)
- @fastify/cors (CORS entre Nuxt e Fastify)
- jsonwebtoken (JWT access + refresh tokens)

## Scope

**v1 includes:**
- Cadastro de Profissionais (autônomas parceiras que alugam espaço) — Nome Completo, CPF, Telefone, Senha
- Cadastro de Serviços (com valores e duração, por profissional)
- Cadastro de Clientes (nome + telefone, sem email/senha)
- Agenda compartilhada — proprietária vê e gerencia agendas de todas; autônoma parceira vê horários ocupados de todas mas gerencia só a própria
- Bloqueio de agenda individual (cada uma bloqueia a própria)
- **Autoatendimento do cliente** — link público, informa telefone, escolhe profissional/serviço/horário, cancela próprio agendamento
- Dashboard individual (autônoma parceira: própria agenda, seus clientes, seus valores)
- Dashboard da proprietária (visão consolidada financeira, agenda de todas, clientes)
- Script de seed para primeiro uso (OWNER admin)

**Explicitly out of scope (v1):**
- Relatórios para extração de dados (v2)
- Bot de WhatsApp conversacional para agendamento (v2)
- Pagamento online
- Notificações push ou SMS
- App mobile nativo
- Controle de estoque (v2)

## Infrastructure

### Fases

**Fase 1 — Desenvolvimento Local:** MVP construído e testado inteiramente em ambiente local com Docker Compose (db + backend) e servidores dev Nuxt para os frontends. Sem dependências de nuvem durante o desenvolvimento.

**Fase 2 — Produção:** Deploy em VPS Oracle Cloud (Always Free — VM Arm Ampere A1). Mesma stack de containers. Deploy automatizado via GitHub Actions (planejado).

### Arquitetura de Containers

2 containers na mesma rede Docker (frontends rodam localmente via `npm run dev:*`):

| Container        | Função                          | Expõe porta |
| ---------------- | ------------------------------- | ----------- |
| `db`             | PostgreSQL nativo                | 5432        |
| `backend`        | Fastify API + regras de negócio  | 3001        |

### Database

PostgreSQL nativo via container Docker. Sem limitações serverless. Conexão direta com suporte total a prepared statements (`prepare: true` no postgres.js).

### Frontend

3 pacotes Nuxt 4 com `routeRules`:

| Pacote | Rotas | Framework | SSR |
|--------|-------|-----------|-----|
| `packages/landing` | `/` (landing), `/agendar` (booking) | Nuxt 4 + Tailwind CSS | SSR (/) / SPA (/agendar) |
| `packages/dashboard` | `/login`, `/dashboard/*` | Nuxt 4 + Nuxt UI | SPA |
| `packages/agenda` | (reservado para futuro) | Nuxt 4 + Tailwind CSS | SPA |

### Normalização de Telefone

- **Banco:** Armazenar apenas dígitos (DDD + número), 10-11 chars. Sem prefixo 55.
- **Zod:** `z.string().transform()` para limpar não-dígitos e remover 55/+55 do payload.
- **Frontend:** Máscara visual apenas. Limpa dados antes do envio.

## Constraints

- Timeline: Moderado (semanas a poucos meses)
- Recursos: Projeto pessoal, sem equipe dedicada
- Infra: Docker Compose (dev) → Oracle Cloud VPS (prod)
- Deploy: GitHub Actions
- Escopo inicial: Foco na agenda compartilhada + autoatendimento do cliente como prioridades
