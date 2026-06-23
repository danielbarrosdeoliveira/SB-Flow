# SB-Flow — Roadmap

**Última atualização:** 2026-06-22

---

## Fase 1: Desenvolvimento Local (Docker Compose)

### Milestone 1: Fundação — Setup do Projeto ✅

- [x] Inicializar monorepo (raiz com `api/` e `packages/`)
- [x] Configurar TypeScript, Biome, tooling compartilhado
- [x] Configurar Docker Compose (db + backend)
- [x] Configurar Fastify + DrizzleORM + PostgreSQL (container `db`)
- [x] Configurar Nuxt 4 + TailwindCSS + Vuetify + routeRules
- [x] Configurar autenticação (JWT)
- [x] Script de seed (OWNER admin)
- [x] Schema inicial do banco de dados
- [x] Validar pipeline local completo

### Milestone 2: Agenda Compartilhada + Autoatendimento ✅

**Prioridade máxima. Concluído.**

- [x] Cadastro de Profissionais (autônomas parceiras)
- [x] Cadastro de Serviços (por profissional, com valores + duração)
- [x] Cadastro de Clientes
- [x] CRUD Agendamentos (proprietária gerencia todas; parceira gerencia só a própria)
- [x] Visualização de agenda compartilhada (todos veem horários ocupados sem ver valores)
- [x] Bloqueio de agenda individual
- [x] Dashboard individual (agenda do dia, clientes, valores próprios)
- [x] **Autoatendimento do cliente** — link público, informa telefone, escolhe profissional/serviço/horário
- [x] Tempo real (SSE) para atualizações

### Milestone 3: Dashboards 🟡 (em andamento)

- [ ] Dashboard da proprietária (visão financeira geral)
- [ ] Movimentação financeira por profissional
- [ ] Polimento UI/UX
- [x] Landing page do salão (SSR)
- [x] Depoimentos com fotos e autor alinhado
- [x] Carrossel infinito
- [ ] Página "Meus Agendamentos" para clientes
- [x] Stack visual migrada: Vuetify → Nuxt UI v4 + Tailwind CSS

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
