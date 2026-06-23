# Dashboard — Layout e Tela Inicial

**Status:** Pendente
**Prioridade:** Alta
**Dependências:** AD-037 (Nuxt UI v4), DASHBOARD-02 (Auth middleware)

---

## DASHBOARD-03: Layout base com sidebar collapsible

**O que:** Criar layout do dashboard com sidebar retrátil usando Nuxt UI v4.

**Onde:** `packages/dashboard/layouts/dashboard.vue`

**Componentes:**
- `USidebar` com `collapsible="icon"` e `v-model:open` controlado por `useLocalStorage('sidebar-open', true)`
- `UNavigationMenu` com `orientation="vertical"` e `collapsed` sincronizado com estado da sidebar
- Itens de navegação: Dashboard, Clientes, Profissionais, Agendamentos, Configurações
- Header fixo (h-16) com botão toggle `i-lucide-panel-left` e título da página
- `<main>` com rolagem vertical ocupando o resto da tela

**Grid responsivo:**
- `xl` (>=1280px): 12 colunas — conteúdo central (9 cols) + sidebar direita (3 cols)
- Abaixo de `xl`: 1 coluna, sidebar direita vai para baixo

**Seções do conteúdo central:**
1. Linha com 4 mini-cards de KPIs lado a lado
2. Bloco do gráfico de faturamento (placeholder)
3. Tabela de listagem de agendamentos (placeholder)

**Seções da sidebar direita (3 cols, apenas xl):**
1. Calendário mensal de operação (placeholder)
2. Timeline de atividades recentes (placeholder)

**Estilos:**
- Fundo do container: `var(--color-foreground)`
- Cards: `bg-[var(--color-warm)]/10`, `border border-[var(--color-warm)]/20`, `rounded-xl`
- Link ativo: herdar `var(--color-primary)`
- Nenhuma cor base do Tailwind (zinc, slate, blue, gray)

**Critério de aceite:**
- Sidebar colapsa para ícones ao clicar no toggle
- Estado persistido em localStorage
- Grid responsivo funciona em diferentes tamanhos de tela
- Navegação entre páginas do dashboard funciona

---

## DASHBOARD-04: Tela inicial do dashboard com KPIs e placeholders

**O que:** Implementar a página `/dashboard/` com cards de métricas e blocos de conteúdo.

**Onde:** `packages/dashboard/pages/dashboard/index.vue`

**Conteúdo:**
- 4 KPIs (Agendamentos Hoje, Receita Hoje, Clientes Atendidos, Taxa de Ocupação)
- Bloco placeholder para gráfico de faturamento
- Bloco placeholder para tabela de agendamentos
- Bloco placeholder para calendário mensal
- Bloco placeholder para feed de atividades

**Critério de aceite:**
- KPIs exibidos em linha no desktop, empilhados em mobile
- Todos os blocos renderizam sem erro
- Layout responsivo funciona
