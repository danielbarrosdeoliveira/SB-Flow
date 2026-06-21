# State

**Last Updated:** 2026-06-20T00:00:00Z
**Current Work:** Docs commit — AD-024 registrado, seguindo para TANSTACK-02 (use-services + use-clients composables)

---

## Recent Decisions (Last 60 days)

### AD-001: Monorepo raiz com `api/` e `web/` (2026-06-19)

**Decision:** Usar monorepo raiz com duas pastas (`api/` e `web/`) em vez de monorepo tooling (pnpm workspaces, turborepo, etc.)
**Reason:** Projeto pessoal, simplicidade inicial. Se crescer, migra-se para tooling mais robusto.
**Trade-off:** Menos isolamento entre frontend e backend, sem caching de build compartilhado.
**Impact:** Configurações de TypeScript e Biome na raiz com subprojetos referenciando.

### AD-002: WhatsApp Bot Conversacional postergado para v2 (2026-06-19)

**Decision:** Bot de WhatsApp conversacional não será implementado no v1. Apenas envio de código de verificação via EvolutionAPI entra no v1.
**Reason:** Complexidade adicional (fluxo conversacional, webhooks) atrasaria a entrega do problema central (agenda compartilhada).
**Trade-off:** Clientes continuarão agendando via WhatsApp humano ou autoatendimento web.
**Impact:** v1 inclui autoatendimento web do cliente + verificação WhatsApp mínima (código). Bot conversacional fica para v2.

### AD-003: Foco inicial na agenda compartilhada (2026-06-19)

**Decision:** A agenda compartilhada é a prioridade máxima do v1.
**Reason:** É o problema real que motivou o projeto (conflito de agenda entre profissionais que dividem espaço).
**Trade-off:** Outras features (relatórios, dashboards financeiros) vêm depois.
**Impact:** O roadmap foi organizado para entregar a agenda primeiro.

### AD-004: Modelo de negócio — autônomas parceiras que alugam espaço (2026-06-19)

**Decision:** O sistema trata as profissionais como autônomas parceiras que alugam espaço, não como funcionárias. A proprietária gerencia os agendamentos de todas.
**Reason:** A realidade do Studio Blessed é uma parceria, não vínculo empregatício. A proprietária faz os agendamentos para ambas porque as clientes frequentemente querem ser atendidas pelas duas no mesmo dia.
**Trade-off:** Não serve para modelos tradicionais de salão com vínculo CLT.
**Impact:** Permissões do sistema: proprietária vê e gerencia agendas de todas; autônoma parceira gerencia só a própria agenda mas vê horários ocupados de todas. Valores financeiros são privados por profissional.

### AD-005: SSR + SPA híbrido (2026-06-19) — 🔄 SUPERSEDED by AD-012

**Decision original:** Landing page do Studio Blessed em SSR (SEO); dashboard autenticado como SPA com atualizações em tempo real (SSE/WebSocket).
**Reason original:** Landing page precisa de boa indexação em buscadores e carregamento rápido inicial. Dashboard precisa de interatividade rica e tempo real sem recarregar.
**Status:** Substituída por AD-012 (Nuxt 3 com routeRules). Conceito de SSR + SPA mantido, implementação migrada de Vite multi-entry para Nuxt.

### AD-006: Tempo real via SSE (2026-06-19) — ⚡ NARROWED by AD-017

**Decision original:** Atualizações em tempo real para criação, edição, cancelamento e bloqueio de agendamentos.
**Reason:** Se um agendamento for cancelado, o horário precisa ser liberado imediatamente para evitar confusão entre as profissionais.
**Trade-off original:** Maior complexidade no backend comparado a polling simples.
**Status:** Decisão de *ter* tempo real mantida. AD-017 refinou o *como*: SSE (não WebSocket), apenas no dashboard (cliente usa REST).

### AD-007: Autoatendimento do cliente antecipado para v1 (2026-06-19)

**Decision:** Cliente pode agendar e cancelar próprios horários via link público, com verificação de telefone via WhatsApp.
**Reason:** Sua esposa identificou que o maior gargalo hoje é o tempo gasto respondendo WhatsApp para agendar clientes. Autoatendimento resolve isso.
**Trade-off:** Aumenta escopo do v1 significativamente. Depende de integração EvolutionAPI (mesmo que mínima).
**Impact:** Spec precisa de novas stories P1 para fluxo do cliente. EvolutionAPI entra como dependência v1 (apenas envio de código).

### AD-008: Seed de dados na primeira migração (2026-06-19)

**Decision:** Script de seed cria apenas a conta OWNER (admin) na primeira migração. Parceiras e serviços são cadastrados pela proprietária depois pelo sistema.
**Reason:** A proprietária pode configurar os dados reais (serviços, valores, parceiras) diretamente no sistema, sem depender de seed fixo.
**Trade-off:** Primeiro uso exige que a proprietária cadastre ao menos um serviço antes de testar agendamentos.
**Seed data:** lido de variáveis de ambiente (`SEED_ADMIN_NAME`, `SEED_ADMIN_PHONE`, `SEED_ADMIN_CPF`, `SEED_ADMIN_PASSWORD`)

### AD-009: Login profissional apenas por telefone + senha (2026-06-19)

**Decision:** Profissionais (OWNER e PARTNER) autenticam apenas com telefone + senha. Sem opção de email.
**Reason:** Simplicidade — profissionais do salão usam WhatsApp como canal principal, email é irrelevante.
**Trade-off:** Se um dia precisar de recuperação de senha sem WhatsApp, vai depender de email.
**Impact:** Tabela `professionals` não precisa de coluna email. Login verifica telefone normalizado.

### AD-010: Cadastro de parceiros com CPF (2026-06-19)

**Decision:** Cadastro de profissionais inclui Nome Completo, CPF, Telefone, Senha. Tanto OWNER quanto PARTNER.
**Reason:** Controle fiscal e identificação única. CPF evita duplicatas e será usado em relatórios financeiros futuros.
**Trade-off:** CPF adiciona complexidade de validação (formato, dígitos verificadores) e é dado sensível (LGPD).
**Impact:** Validar CPF no frontend e backend. Armazenar de forma segura (hash não é possível pois CPF é identificador, mas pode ser criptografado em repouso).

### AD-011: Vuetify substitui ShadcnVue + TailwindCSS + Schedule-X (2026-06-19) — 🔄 PARTIALLY SUPERSEDED by AD-024

**Decision:** UI migrada para Vuetify (Material Design 3). Remove ShadcnVue e Schedule-X.
**Reason:** Vuetify tem calendário nativo Vue 3 que reage naturalmente a dados reativos, eliminando risco de integração com Schedule-X. Menos dependências, stack mais coesa.
**Trade-off:** Bundle maior (Vuetify é mais pesado que componentes isolados). Design Material Design em vez de custom.
**Impact:** Remove Schedule-X, ShadcnVue do package.json. Adiciona Vuetify. TailwindCSS mantido na landing page e área do cliente (/agendar).

### AD-012: Nuxt 3 com routeRules substitui Vite multi-entry (2026-06-19) — 🔄 PARTIALLY SUPERSEDED by AD-024

**Decision:** Stack frontend migra para Nuxt 3 com `routeRules`: `/` → SSR (Tailwind), `/dashboard/**` → SPA (Vuetify), `/agendar/**` → SPA (Vuetify).
**Reason:** Nuxt lida nativamente com SSR + SPA híbrido via routeRules. Elimina configuração manual de multi-entry no Vite. Módulos oficiais `@nuxtjs/tailwindcss` e `vuetify-nuxt-module` integram sem atrito.
**Trade-off:** Nuxt é mais opinionado que Vite puro. Dependência extra do `nitro` como servidor Node (pode conviver com Fastify via `server/` directory ou separação total).
**Impact:** `web/` vira um projeto Nuxt 3. Fastify continua separado em `api/`. Comunicação via HTTP (REST). Config do Nuxt com `routeRules` e modules declarados. Rota `/agendar/**` muda de Vuetify para Tailwind conforme AD-024.

### AD-014: Normalização de telefone (2026-06-19)

**Decision:** Armazenar apenas dígitos (DDD + número, 10-11 chars). Sem prefixo 55 no banco. Backend adiciona +55 dinamicamente para EvolutionAPI. Zod transform limpa input no backend.
**Reason:** Consistência nas buscas, login e cadastro. Elimina duplicatas por formatação.
**Trade-off:** Perde formatação original. Exibição precisa de máscara de saída na UI.
**Implementation:**
  - DB: `VARCHAR(11)` — apenas dígitos, sem 55
  - Zod: `z.string().transform(v => v.replace(/\D/g, '').replace(/^55/, ''))`
  - EvolutionAPI: `55${phone}` no momento da chamada
  - Frontend: input mask para exibição, strip não-dígitos no envio
  - Busca: normalizar input do usuário antes de comparar com banco

### AD-013: Terminologia de negócio padronizada (2026-06-19)

**Decision:** Usar consistentemente: Proprietária (OWNER), Autônoma Parceira (PARTNER), Cliente (CLIENT). Nunca "funcionária".
**Reason:** O modelo de negócio é parceria, não vínculo empregatício. A terminologia reflete a realidade do Studio Blessed.
**Trade-off:** Documentos e código precisam ser revisados para consistência.
**Impact:** Roles no CASL.js, labels na UI, documentação — tudo padronizado.

### AD-015: Infraestrutura Docker Compose + Oracle Cloud (2026-06-19)

**Decision:** MVP desenvolvido localmente com Docker Compose (4 containers: db, backend, frontend, evolution-api). Produção em VPS Oracle Cloud (VM Arm Ampere A1, Always Free) com mesma stack de containers e deploy via GitHub Actions.
**Reason:** PostgreSQL nativo em container elimina limitações de serverless (Neon, pgBouncer, prepared statements). Ambiente idêntico entre dev e prod. Oracle Always Free é custo zero para projeto pessoal.
**Trade-off:** Responsabilidade de gerenciar o próprio banco (backup, upgrades, segurança). VPS precisa de manutenção.
**Impact:** Docker Compose como peça central. `docker-compose.yml` na raiz com 4 services. GitHub Actions para deploy via SSH + docker-compose pull/up na VPS. Domínio + SSL via Cloudflare.

### AD-016: Prepared Statements ativados (2026-06-19)

**Decision:** `prepare: true` no postgres.js (Drizzle ORM). PostgreSQL nativo via Docker suporta prepared statements sem limitações.
**Reason:** Container PostgreSQL nativo não tem pgBouncer entre a aplicação e o banco. Prepared statements trazem benefício de performance e segurança (proteção contra SQL injection).
**Trade-off:** Incompatível com Neon serverless pooler — não relevante pois infra é Docker nativo.
**Impact:** Configuração Drizzle padrão com `prepare: true`. Migrations rodam via `drizzle-kit` diretamente no container db.

### AD-017: SSE confirmado para tempo real no dashboard (2026-06-19)

**Decision:** SSE unidirecional servidor→cliente exclusivamente para o dashboard administrativo. Área de autoatendimento do cliente opera apenas via HTTP REST.
**Reason:** SSE resolve o caso de uso (notificações de novos/cancelados/editados agendamentos) com baixa complexidade. Cliente não precisa de tempo real — faz requisições sob demanda.
**Trade-off:** Limite de ~6 conexões SSE por browser. Não enviar timeout. Autenticação via cookie (não header).
**Impact:** Fastify expõe endpoint `/api/sse` (autenticado via cookie). Nuxt consome com `EventSource`. Cliente booking usa REST puro.

### AD-018: Autenticação via duplo cookie HTTP-Only (2026-06-19)

**Decision:** Dois cookies: `access_token` (15 min) para validação de requisições + SSE; `refresh_token` (30 dias) para renovação silenciosa. Ambos HttpOnly, SameSite=Strict, Secure. Nuxt implementa interceptor global de refresh.
**Reason:** EventSource nativo não envia headers customizados. Cookies resolvem autenticação do SSE sem trabalho extra. Refresh silencioso evita logout inesperado durante o expediente.
**Trade-off:** Vulnerável a CSRF se não usar SameSite. Token no cookie não funciona em API third-party.
**Impact:** Fastify com rota `/api/auth/refresh`. Nuxt plugin intercepta 401, chama refresh, repete requisição. SSE autentica via cookie automaticamente.

### AD-019: Auto-lock por inatividade + PIN rápido — postergado para v2 (2026-06-19)

**Decision original:** Dashboard Nuxt monitora inatividade (X min configurável). Ao atingir o limite, oculta dados sensíveis + exibe tela de bloqueio. Destrava com PIN de 4 dígitos.
**Status:** Postergado para v2. MVP já está carregado com agenda, autoatendimento e SSE. Auto-lock é importante mas não resolve o problema central de agenda.

### AD-020: Transações com checagem de disponibilidade (2026-06-19)

**Decision:** Toda criação de agendamento usa `db.transaction()` no Drizzle com checagem de disponibilidade imediatamente antes do insert. Verifica sobreposição com agendamentos existentes e bloqueios no mesmo milissegundo.
**Reason:** Múltiplos clientes e profissionais acessam a agenda simultaneamente. Sem transação, duas requisições podem ler disponibilidade, ver horário livre, e ambas inserir — criando dupla reserva.
**Trade-off:** Leve overhead de performance (transação + lock). Impacto irrelevante para o volume do salão.
**Impact:** Função `createAppointment()` encapsulada em transação. SELECT de verificação + INSERT dentro da mesma transação. Rollback automático se conflito detectado. Retorno de erro 409 Conflict para o cliente.

### AD-021: Relatórios postergados para v2 (2026-06-19)

**Decision:** Relatórios removidos do escopo v1. Serão especificados e implementados no v2.
**Reason:** MVP já está carregado (agenda, autoatendimento, SSE). Relatórios não são críticos para o funcionamento diário do salão.
**Trade-off:** Proprietária não terá relatórios formatados no lançamento. Dashboard com dados brutos por enquanto.
**Impact:** Removido de PROJECT.md v1 scope e ROADMAP Milestone 3. Move para v3 no roadmap.

### AD-024: Booking (/agendar) migra de Vuetify para Tailwind CSS (2026-06-20)

**Decision:** A área de autoatendimento do cliente (`/agendar/**`) usará Tailwind CSS em vez de Vuetify.
**Reason:**
  - Área do cliente deve ser leve e rápida, sem o peso do bundle Vuetify
  - Tailwind CSS é suficiente para páginas de formulário multi-step (seleção de profissional, serviço, horário)
  - Consistência visual com a landing page (também Tailwind)
  - Reduz o bundle carregado pelo cliente (não precisa baixar Vuetify)
**Trade-off:** Duas abordagens de UI no mesmo projeto (Vuetify no dashboard, Tailwind no booking/landing). Componentes UI não são reutilizáveis entre dashboard e booking.
**Impact:**
  - `/agendar/**` continua como SPA (`ssr: false`) mas usa Tailwind CSS em vez de Vuetify
  - Landing page e booking compartilham design system Tailwind
  - Dashboard (/dashboard/**) continua com Vuetify
  - Páginas em `/agendar/` não importam componentes Vuetify
  - AD-011 e AD-012 parcialmente substituídos: Vuetify restrito ao dashboard

### AD-023: TanStack Query (Vue Query) para Server State (2026-06-20)

**Decision:** Adotar `@tanstack/vue-query` para gerenciar todo o estado do servidor (Server State — agendamentos, profissionais, serviços, clientes). Pinia fica exclusivamente responsável pelo estado global local do cliente (Client State — `user`, `isAuthenticated`, `role`, flags de UI).
**Reason:** 
  - Separação clara de responsabilidades: TanStack Query gerencia cache, refetch, stale-while-revalidate e sincronização automática; Pinia gerencia apenas estado da sessão e UI.
  - Evita duplicação de lógica de fetching (loading/error/success) que seria manual no Pinia.
  - Cache query-first reduz requisições desnecessárias.
  - SSR hydration nativa via `dehydrate`/`hydrate` com `useAsyncData`.
**Trade-off:** Dependência adicional no frontend. Curva de aprendizado do TanStack Query (query keys, staleTime, gcTime, mutations).
**Impact:**
  - `@tanstack/vue-query` adicionado como dependência.
  - Nuxt plugin `web/plugins/vue-query.ts` gerencia QueryClient: isolado por requisição SSR, dehydrate no `app:rendered`, hydrate no `app:created`.
  - `web/composables/` — cada domínio tem seu composable (ex: `useAppointments`, `useUserProfile`).
  - `useAuthStore.logout()` chama `queryClient.clear()` ao deslogar.
  - Pinia `auth` store mantém apenas `user`, `isAuthenticated`, `role`, `login()`, `logout()`, `refreshToken()`.

### AD-022: Deploy apenas após validação com usuária final (2026-06-19)

**Decision:** Deploy em Oracle Cloud ocorre somente após a proprietária do Studio Blessed validar o MVP em ambiente local (Docker Compose).
**Reason:** Evita custo de infraestrutura e complexidade de deploy enquanto as regras de negócio ainda podem mudar com base no feedback real.
**Trade-off:** Sistema não fica acessível fora da rede local durante a validação. A proprietária precisa acessar via `localhost` ou IP local.
**Impact:** Milestone de deploy separada em "Validação com proprietária" → "Deploy". GitHub Actions e Oracle Cloud configurados só depois do sinal verde.

---

## Active Blockers

*Nenhum bloqueador ativo.*

---

## Preferences

**Model Guidance Shown:** never
