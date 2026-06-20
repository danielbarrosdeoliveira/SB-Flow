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
- Frontend: Nuxt 3 + TailwindCSS + Vuetify
- Backend: Fastify
- Database: PostgreSQL (Docker)
- ORM: DrizzleORM

**Key dependencies:**
- TypeScript (todo o projeto)
- Nuxt 3 (framework fullstack, gerencia SSR + SPA via routeRules)
- @nuxtjs/tailwindcss (landing page)
- vuetify-nuxt-module (dashboard + agendamento)
- Pinia (Client State — auth, UI flags)
- @tanstack/vue-query (Server State — appointments, professionals, services, clients)
- Zod (validação compartilhada)
- Biome (lint/format)
- Day.js (manipulação de datas para agenda)
- CASL.js (RBAC)
- @tanstack/vue-query (Server State management)
- postgres.js (driver de banco, `prepare: true`)
- SSE (tempo real no dashboard)
- @fastify/cookie (cookies HTTP-Only para auth + SSE)
- @fastify/cors (CORS entre Nuxt e Fastify)
- jsonwebtoken (JWT access + refresh tokens)
- EvolutionAPI (verificação de telefone via WhatsApp)

## Scope

**v1 includes:**
- Cadastro de Profissionais (autônomas parceiras que alugam espaço) — Nome Completo, CPF, Telefone, Senha
- Cadastro de Serviços (com valores e duração, por profissional)
- Cadastro de Clientes (nome + telefone, sem email/senha)
- Agenda compartilhada — proprietária vê e gerencia agendas de todas; autônoma parceira vê horários ocupados de todas mas gerencia só a própria
- Bloqueio de agenda individual (cada uma bloqueia a própria)
- **Autoatendimento do cliente** — link público, login por telefone com verificação WhatsApp, escolha de profissional/serviço/horário, cancelamento próprio
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

**Fase 1 — Desenvolvimento Local:** MVP construído e testado inteiramente em ambiente local com Docker Compose. Sem dependências de nuvem durante o desenvolvimento.

**Fase 2 — Produção:** Deploy em VPS Oracle Cloud (Always Free — VM Arm Ampere A1). Mesma stack de containers. Deploy automatizado via GitHub Actions.

### Arquitetura de Containers

4 containers na mesma rede Docker:

| Container        | Função                          | Expõe porta |
| ---------------- | ------------------------------- | ----------- |
| `db`             | PostgreSQL nativo                | 5432        |
| `backend`        | Fastify API + regras de negócio  | 3001        |
| `frontend`       | Nuxt 3 (SSR landing + SPA dash) | 3000        |
| `evolution-api`  | EvolutionAPI WhatsApp            | 8080        |

### Database

PostgreSQL nativo via container Docker. Sem limitações serverless. Conexão direta com suporte total a prepared statements (`prepare: true` no postgres.js).

### Frontend

Nuxt 3 com `routeRules`:
- `/` → SSR (landing page com TailwindCSS, indexação SEO)
- `/dashboard/**` → SPA (Vuetify, dashboard profissional)
- `/agendar/**` → SPA (Vuetify, autoatendimento cliente)

### Normalização de Telefone

- **Banco:** Armazenar apenas dígitos (DDD + número), 10-11 chars. Sem prefixo 55.
- **EvolutionAPI:** Backend adiciona prefixo `55` dinamicamente nas requisições.
- **Zod:** `z.string().transform()` para limpar não-dígitos e remover 55/+55 do payload.
- **Frontend:** Máscara visual apenas. Limpa dados antes do envio.

## Constraints

- Timeline: Moderado (semanas a poucos meses)
- Recursos: Projeto pessoal, sem equipe dedicada
- Infra: Docker Compose (dev) → Oracle Cloud VPS (prod)
- Deploy: GitHub Actions
- Escopo inicial: Foco na agenda compartilhada + autoatendimento do cliente como prioridades
