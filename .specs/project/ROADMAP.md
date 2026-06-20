# SB-Flow — Roadmap

**Última atualização:** 2026-06-19

---

## Fase 1: Desenvolvimento Local (Docker Compose)

### Milestone 1: Fundação — Setup do Projeto (Semana 1)

- [ ] Inicializar monorepo (raiz com `api/` e `web/`)
- [ ] Configurar TypeScript, Biome, tooling compartilhado
- [ ] Configurar Docker Compose (db + backend + frontend + evolution-api)
- [ ] Configurar Fastify + DrizzleORM + PostgreSQL (container `db`)
- [ ] Configurar Nuxt 3 + TailwindCSS + Vuetify + routeRules
- [ ] Configurar autenticação (JWT)
- [ ] Script de seed (OWNER admin)
- [ ] Schema inicial do banco de dados
- [ ] Validar pipeline local completo

### Milestone 2: Agenda Compartilhada + Autoatendimento (Semanas 2-5)

**Prioridade máxima.**

- [ ] Cadastro de Profissionais (autônomas parceiras)
- [ ] Cadastro de Serviços (P1, por profissional, com valores + duração)
- [ ] Cadastro de Clientes
- [ ] CRUD Agendamentos (proprietária gerencia todas; parceira gerencia só a própria)
- [ ] Visualização de agenda compartilhada (todos veem horários ocupados sem ver valores)
- [ ] Bloqueio de agenda individual
- [ ] Dashboard individual (agenda do dia, clientes, valores próprios)
- [ ] **Autoatendimento do cliente** — link público, login por telefone + verificação WhatsApp, escolha profissional/serviço/horário
- [ ] **Cliente ver/cancelar próprios agendamentos**
- [ ] Integração EvolutionAPI para verificação de telefone
- [ ] Tempo real (SSE) para atualizações

### Milestone 3: Dashboards (Semanas 6-7)

- [ ] Dashboard da proprietária (visão financeira geral)
- [ ] Movimentação financeira por profissional
- [ ] Polimento UI/UX
- [ ] Landing page do salão (SSR)

---

## Fase 2: Validação e Deploy

### Milestone 4: Validação com a Proprietária

- [ ] Testes end-to-end dos fluxos críticos com usuária real (Studio Blessed)
- [ ] Ajustes baseados no feedback

### Milestone 5: Deploy (Oracle Cloud + GitHub Actions)

- [ ] Provisionar VPS Oracle Cloud (VM Arm Ampere A1, Always Free)
- [ ] Configurar Docker Compose na VPS (mesma stack local)
- [ ] Configurar GitHub Actions para deploy automatizado
- [ ] Configurar domínio + SSL (Cloudflare ou Oracle LB)
- [ ] Deploy oficial (produção)

---

## Próximas Versões (pós-v1)

### v2 — Bot WhatsApp Conversacional
- Integração EvolutionAPI completa (fluxo conversacional)
- Agendamento via WhatsApp
- Lembretes automáticos

### v3 — Expansão
- Auto-lock por inatividade + desbloqueio PIN
- Relatórios para extração de dados
- Controle de estoque
- Métodos de pagamento
- Integração Google Calendar (OAuth, sync bidirecional, ler agenda pessoal da profissional e criar bloqueios automáticos)
