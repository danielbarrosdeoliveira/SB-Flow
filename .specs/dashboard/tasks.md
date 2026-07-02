# Dashboard — Tasks

**Package:** `packages/dashboard`
**Status:** Pending

---

## Phase 1: Dashboard UI

Criar o layout e páginas do dashboard com Nuxt UI v4.

### DASHBOARD-03: Layout base com sidebar collapsible

**O que:** Criar layout do dashboard com sidebar retrátil usando Nuxt UI v4.
**Onde:** `packages/dashboard/app/features/dashboard/layouts/dashboard.vue`
**Dependências:** AD-037 (Nuxt UI v4), AUTH-06 (auth middleware)
**Requisito:** Layout funcional com navegação

**Componentes:**
- `USidebar` com `collapsible="icon"` e `v-model:open` controlado por `useLocalStorage('sidebar-open', true)`
- `UNavigationMenu` com `orientation="vertical"` e `collapsed` sincronizado com estado da sidebar
- Itens: Dashboard, Clientes, Profissionais, Agendamentos, Configurações
- Header fixo (h-16) com toggle e título da página
- `<main>` com rolagem vertical

**Grid responsivo:**
- `xl` (>=1280px): 12 colunas — conteúdo central (9 cols) + sidebar direita (3 cols)
- Abaixo de `xl`: 1 coluna

**Done when:**
- [ ] Sidebar colapsa para ícones ao clicar no toggle
- [ ] Estado persistido em localStorage
- [ ] Grid responsivo funciona
- [ ] Navegação entre páginas funciona

---

### DASHBOARD-04: Tela inicial do dashboard com KPIs e placeholders

**O que:** Implementar a página `/dashboard/` com cards de métricas e blocos de conteúdo.
**Onde:** `packages/dashboard/app/features/dashboard/pages/index.vue`
**Dependências:** DASHBOARD-03
**Requisito:** Dashboard index funcional

**Conteúdo:**
- 4 KPIs (Agendamentos Hoje, Receita Hoje, Clientes Atendidos, Taxa de Ocupação)
- Bloco placeholder para gráfico de faturamento
- Bloco placeholder para tabela de agendamentos
- Bloco placeholder para calendário mensal
- Bloco placeholder para feed de atividades

**Done when:**
- [ ] KPIs exibidos em linha no desktop, empilhados em mobile
- [ ] Todos os blocos renderizam sem erro
- [ ] Layout responsivo funciona

---

### DASHBOARD-05: Página de Serviços (CRUD Completo)

**O que:** Implementar CRUD completo de serviços com seletor de profissional baseado no role.
**Onde:** `packages/dashboard/app/features/treatments/pages/servicos.vue`
**Dependências:** DASHBOARD-03
**Requisito:** Gestão de serviços funcional com todas as operações

---

#### Regra de UI (CRÍTICA)

| Role | Comportamento |
|------|---------------|
| **OWNER** | Vê seletor de profissional no topo da página. Pode selecionar qualquer profissional para gerenciar seus serviços. |
| **PARTNER** | Não vê seletor. Campo fixo na própria profissional logada. Não consegue trocar. |

---

#### Estrutura de Dados

```typescript
interface Service {
  id: string
  professionalId: string
  name: string
  durationMinutes: number
  price: number
  description: string | null
  isActive: boolean
}
```

---

#### DASHBOARD-05.1: Listagem de Serviços

**O que:** Tabela com lista de serviços filtrada por profissional.

**Implementação:**
- Tabela com colunas: Nome, Duração (min), Preço, Ações
- Seletor de profissional no topo (OWNER only; PARTNER não vê)
- Ao trocar profissional (OWNER), recarrega lista via TanStack Query
- PARTNER carrega serviços automaticamente da profissional logada
- Indicador de loading durante fetch
- Indicador visual quando lista vazia: "Nenhum serviço cadastrado"

**Done when:**
- [ ] OWNER vê seletor de profissional no topo
- [ ] PARTNER não vê seletor
- [ ] Lista de serviços atualiza ao trocar profissional (OWNER)
- [ ] PARTNER vê apenas os próprios serviços
- [ ] Loading state exibido durante fetch
- [ ] Estado vazio tratado com mensagem adequada

---

#### DASHBOARD-05.2: Criar Serviço

**O que:** Modal para criar novo serviço vinculado a uma profissional.

**Implementação:**
- Botão "+ Novo Serviço" abre modal
- Campos: Nome, Duração (min), Preço (R$), Descrição (opcional)
- Profissional vinculada ao serviço:
  - OWNER: usa a profissional selecionada no seletor
  - PARTNER: usa automaticamente a profissional logada
- Validação Zod: nome obrigatório, duração > 0, preço >= 0
- POST via `useMutation` do TanStack Query
- Invalida query de serviços após criar com sucesso
- Fecha modal e mostra toast de sucesso

**Done when:**
- [ ] Botão "+ Novo Serviço" abre modal
- [ ] Campos validam corretamente (nome, duração, preço)
- [ ] OWNER cria serviço para profissional selecionada
- [ ] PARTNER cria serviço para si mesmo (campo oculto)
- [ ] Mutation invoca API correta
- [ ] Query invalidada após sucesso
- [ ] Toast de sucesso exibido
- [ ] Modal fecha após criar

---

#### DASHBOARD-05.3: Editar Serviço

**O que:** Modal para editar serviço existente.

**Implementação:**
- Botão de editar (lápis) em cada linha da tabela
- Abre modal com campos pré-preenchidos
- Campos: Nome, Duração (min), Preço (R$), Descrição (opcional)
- Profissional vinculada não pode ser alterada na edição
- Validação Zod idêntica à criação
- PUT via `useMutation` do TanStack Query
- RBAC: OWNER pode editar qualquer serviço; PARTNER apenas os próprios
- Invalida query após sucesso

**Done when:**
- [ ] Botão de editar abre modal com dados pré-preenchidos
- [ ] Campos são editáveis (exceto profissional)
- [ ] OWNER pode editar qualquer serviço
- [ ] PARTNER só edita próprios serviços (RBAC verificado no backend)
- [ ] Mutation invoca API correta
- [ ] Query invalidada após sucesso
- [ ] Toast de sucesso exibido
- [ ] Modal fecha após editar

---

#### DASHBOARD-05.4: Excluir Serviço

**O que:** Lógica de exclusão com soft delete e confirmação.

**Fluxo de Exclusão:**
```
Usuário clica "Excluir"
  → ConfirmationDialog: "Deseja excluir {nome}?"
  → API retorna se tem appointments vinculados
  → Se TEM appointments: soft delete (isActive = false) → "Serviço desativado"
  → Se NÃO TEM: delete físico → "Serviço excluído"
```

**Implementação:**
- Botão de excluir (lixeira) em cada linha
- Confirmação antes de excluir
- DELETE via `useMutation`
- Backend decide: soft delete vs physical delete
- RBAC: OWNER pode excluir qualquer; PARTNER apenas os próprios
- Invalida query após sucesso

**Done when:**
- [ ] Botão de excluir abre confirmação
- [ ] Mensagem de confirmação mostra nome do serviço
- [ ] Se tem appointments → soft delete (isActive=false)
- [ ] Se não tem appointments → exclusão física
- [ ] OWNER pode excluir qualquer serviço
- [ ] PARTNER só exclui próprios serviços (RBAC no backend)
- [ ] Query invalidada após exclusão
- [ ] Toast مناسب exibido (sucesso ou erro)

---

## Phase 2: Dashboard DDD Restructuring

Reorganizar `packages/dashboard` de estrutura plana para DDD (`app/features/{domain}/`).

**Dependência:** DASHBOARD-04 (UI precisa existir antes de reorganizar)

### Estrutura Alvo

```
packages/dashboard/app/
├── features/
│   ├── auth/              # stores, middleware, pages/login
│   ├── clients/          # composables, pages/clientes
│   ├── appointments/     # composables, pages/agenda, components
│   ├── treatments/       # composables, pages/servicos
│   ├── professionals/    # pages/profissionais
│   └── dashboard/        # layouts, pages/index
└── shared/
    ├── composables/       # use-sse, use-user-profile
    ├── stores/            # layout
    ├── utils/             # api, phone
    └── plugins/           # vue-query
```

### T1: Criar estrutura de diretórios features/

**Where:** `packages/dashboard/app/features/`
**Depende de:** None
**Requisito:** DDD-01

**Done when:**
- [ ] `features/auth/{stores,middleware,pages}/` criados
- [ ] `features/clients/{composables,pages}/` criados
- [ ] `features/appointments/{composables,pages,components}/` criados
- [ ] `features/treatments/{composables,pages}/` criados
- [ ] `features/professionals/{pages}/` criados
- [ ] `features/dashboard/{layouts,pages}/` criados
- [ ] `shared/{composables,stores,utils,plugins}/` criados

---

### T2: Migrar domain auth

**What:** Mover stores/auth.ts, middleware/auth.ts, pages/login.vue para features/auth/
**Where:** `packages/dashboard/app/features/auth/`
**Depende de:** T1
**Requisito:** DDD-02

**Done when:**
- [ ] `auth/stores/auth.ts` existe com conteúdo original
- [ ] `auth/middleware/auth.ts` existe com conteúdo original
- [ ] `auth/pages/login.vue` existe com conteúdo original
- [ ] Arquivos originais removidos

---

### T3: Migrar domain clients

**What:** Mover use-clients.ts e clientes.vue para features/clients/
**Where:** `packages/dashboard/app/features/clients/`
**Depende de:** T1
**Requisito:** DDD-03

**Done when:**
- [ ] `clients/composables/use-clients.ts` existe com conteúdo original
- [ ] `clients/pages/clientes.vue` existe com conteúdo original
- [ ] Arquivos originais removidos

---

### T4: Migrar domain appointments

**What:** Mover use-appointments.ts, agenda.vue e AppointmentsCard.vue para features/appointments/
**Where:** `packages/dashboard/app/features/appointments/`
**Depende de:** T1
**Requisito:** DDD-04

**Done when:**
- [ ] `appointments/composables/use-appointments.ts` existe com conteúdo original
- [ ] `appointments/pages/agenda.vue` existe com conteúdo original
- [ ] `appointments/components/AppointmentsCard.vue` existe com conteúdo original
- [ ] Arquivos originais removidos

---

### T5: Migrar domain treatments

**What:** Mover use-services.ts e servicos.vue para features/treatments/
**Where:** `packages/dashboard/app/features/treatments/`
**Depende de:** T1
**Requisito:** DDD-05

**Done when:**
- [ ] `treatments/composables/use-treatments.ts` existe com conteúdo original
- [ ] `treatments/pages/servicos.vue` existe com conteúdo original
- [ ] Arquivos originais removidos

---

### T6: Migrar domain professionals

**What:** Mover profissionais.vue para features/professionals/
**Where:** `packages/dashboard/app/features/professionals/`
**Depende de:** T1
**Requisito:** DDD-06

**Done when:**
- [ ] `professionals/pages/profissionais.vue` existe com conteúdo original
- [ ] Arquivo original removido de `app/pages/dashboard/`

---

### T7: Migrar domain dashboard (layout + index)

**What:** Mover layouts/dashboard.vue e pages/index.vue para features/dashboard/
**Where:** `packages/dashboard/app/features/dashboard/`
**Depende de:** T1
**Requisito:** DDD-07

**Done when:**
- [ ] `dashboard/layouts/dashboard.vue` existe com conteúdo original
- [ ] `dashboard/pages/index.vue` existe com conteúdo original
- [ ] Arquivos originais removidos

---

### T8: Consolidar shared/

**What:** Mover utils/, plugins/, e composables restantes para shared/
**Where:** `packages/dashboard/app/shared/`
**Depende de:** T2-T7
**Requisito:** DDD-08

**Done when:**
- [ ] `shared/utils/api.ts` e `shared/utils/phone.ts` existem
- [ ] `shared/plugins/vue-query.ts` existe
- [ ] `shared/composables/use-sse.ts` e `use-user-profile.ts` existem
- [ ] `shared/stores/layout.ts` existe
- [ ] Arquivos originais de `app/` removidos

---

### T9: Atualizar nuxt.config.ts

**What:** Configurar dirs de features para auto-imports funcionarem
**Where:** `packages/dashboard/nuxt.config.ts`
**Depende de:** T1
**Requisito:** DDD-09

**Done when:**
- [ ] `future.compatibilityVersion: 4` configurado
- [ ] `dirs.composables` inclui `['~/composables', '~/features/*/composables']`
- [ ] Componentes de features descobertos via path extra

---

### T10: Limpar app/ vazio

**What:** Remover diretórios agora vazios em app/
**Where:** `packages/dashboard/app/`
**Depende de:** T2-T8
**Requisito:** DDD-08

**Done when:**
- [ ] Diretórios vazios removidos
- [ ] `features/`, `shared/`, `components/` permanecem

---

### T11: Verificar typecheck

**Where:** `packages/dashboard/`
**Depende de:** T9, T10
**Requisito:** DDD-11

**Done when:**
- [ ] `npm run typecheck` passa com 0 erros

---

### T12: Verificar dev server

**Where:** `packages/dashboard/`
**Depende de:** T9, T10
**Requisito:** DDD-10

**Done when:**
- [ ] `npm run dev` inicia sem erros

---

## Execution Order

```
Phase 1 (Dashboard UI):
  DASHBOARD-03 → DASHBOARD-04 → DASHBOARD-05.1 → DASHBOARD-05.2 → DASHBOARD-05.3 → DASHBOARD-05.4

Phase 2 (DDD Restructuring):
  DASHBOARD-03, DASHBOARD-04, DASHBOARD-05.4 → T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12
```

**Nota:** Phase 2 depende que a UI exista (T1 cria dirs, mas T7 move o layout já construído na Phase 1).

---

## Success Criteria

- [ ] Sidebar colapsa e persiste
- [ ] KPIs renderizam corretamente
- [ ] **DASHBOARD-05.1** Listagem: OWNER vê seletor, PARTNER não vê, lista atualiza
- [ ] **DASHBOARD-05.2** Criação: Modal abre, valida, cria para profissional correta
- [ ] **DASHBOARD-05.3** Edição: Modal abre com dados, edita corretamente
- [ ] **DASHBOARD-05.4** Exclusão: Confirmação, soft delete, RBAC respeitado
- [ ] Estrutura `app/features/{domain}/` e `app/shared/` implementada
- [ ] `npm run typecheck` passa
- [ ] `npm run dev` inicia corretamente