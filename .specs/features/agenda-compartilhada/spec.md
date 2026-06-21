# Agenda Compartilhada — Specification

## Problem Statement

No Studio Blessed, a proprietária e uma autônoma parceira que aluga espaço dividem o mesmo ambiente físico mas não têm visibilidade una da agenda da outra. Agendamentos são controlados via WhatsApp e planilhas, gerando conflitos (dupla reserva) e desconforto com clientes. Não há um registro centralizado que ambas possam consultar em tempo real.

## Goals

- [ ] Eliminar conflitos de agendamento entre a proprietária e a autônoma parceira que compartilham o espaço
- [ ] Permitir que a proprietária gerencie todas as agendas num só lugar
- [ ] Permitir que a autônoma parceira gerencie a própria agenda com visibilidade dos horários ocupados das demais
- [ ] Primeiro agendamento criado no sistema em < 30 segundos

## Out of Scope (v1)

| Feature                             | Reason                                      |
| ----------------------------------- | ------------------------------------------- |
| Bot WhatsApp conversacional         | Postergado para v2                          |
| Recorrência de agendamento          | Postergado para v2                          |
| Controle de estoque                 | Postergado para v2                          |
| Métodos de pagamento                | Postergado para v2 (v1 só registra valor)   |
| Horários de funcionamento           | Controle livre, feito via bloqueios manuais |
| Pagamento online                    | Postergado para v2                          |
| Notificações push / SMS             | Postergado para v2                          |
| App mobile nativo                   | Postergado para v2                          |

---

## User Stories

### P1: Autenticação e Controle de Acesso ⭐ MVP

**User Story**: Como profissional (proprietária ou autônoma parceira), quero acessar minha conta com telefone + senha para ver minha agenda.

**Why P1**: Base de todo o sistema — sem login ninguém acessa nada.

**Acceptance Criteria**:

1. WHEN profissional informa telefone + senha válidos THEN sistema SHALL autenticar e redirecionar ao dashboard
2. WHEN profissional informa credenciais inválidas THEN sistema SHALL exibir mensagem de erro genérica
3. WHEN profissional é OWNER THEN sistema SHALL exibir seletor de profissional no topo da agenda ("Todas", "Profissional X", "Profissional Y")
4. WHEN profissional é PARTNER THEN sistema SHALL fixar a agenda na própria profissional, sem opção de alternar

**Independent Test**: Criar usuário OWNER e PARTNER, logar com ambos, verificar seletor de agenda.

---

### P1: Visualização da Agenda ⭐ MVP

**User Story**: Como usuária, quero ver os agendamentos num calendário visual tipo Google Agenda para entender rapidamente o dia.

**Why P1**: A visualização é o coração da feature — substitui a planilha/WhatsApp.

**Acceptance Criteria**:

1. WHEN usuária acessa o dashboard THEN sistema SHALL exibir calendário semanal com intervalos de 15 minutos
2. WHEN OWNER seleciona "Todas" no filtro THEN sistema SHALL exibir agendamentos de todas as profissionais com cores distintas
3. WHEN OWNER seleciona uma profissional específica THEN sistema SHALL exibir apenas os agendamentos daquela profissional
4. WHEN PARTNER acessa o dashboard THEN sistema SHALL exibir apenas os agendamentos da própria
5. WHEN usuária visualiza agendamento de outra profissional THEN sistema SHALL ocultar o valor financeiro (exibir apenas "valor não informado" ou similar)
6. WHEN usuária visualiza próprio agendamento THEN sistema SHALL exibir o valor completo

**Independent Test**: Criar agendamentos para duas profissionais, logar como PARTNER, verificar que vê os horários ocupados de ambas mas só o valor dos próprios.

---

### P1: Criação de Agendamento ⭐ MVP

**User Story**: Como usuária autorizada, quero criar um agendamento selecionando cliente, serviço, profissional, data e horário.

**Why P1**: Função principal do sistema — registrar atendimentos.

**Acceptance Criteria**:

1. WHEN OWNER cria agendamento THEN sistema SHALL permitir selecionar qualquer profissional
2. WHEN PARTNER cria agendamento THEN sistema SHALL permitir selecionar apenas a si mesma como profissional
3. WHEN usuária seleciona um cliente existente via busca THEN sistema SHALL preencher dados do cliente
4. WHEN cliente não existe THEN sistema SHALL permitir cadastro rápido (Nome + Telefone) no mesmo modal
5. WHEN usuária seleciona um serviço THEN sistema SHALL preencher duração e valor automaticamente (fixos do serviço)
6. WHEN horário escolhido conflita com agendamento existente THEN sistema SHALL exibir aviso de conflito mas permitir prosseguir
7. WHEN agendamento é criado THEN sistema SHALL notificar a profissional responsável pelo agendamento em tempo real (badge/sino no dashboard)
8. WHEN agendamento é criado THEN sistema SHALL exibir confirmação visual e o agendamento no calendário em tempo real

**Independent Test**: Criar agendamento como OWNER para PARTNER + criar agendamento como PARTNER para si mesma.

---

### P1: Edição e Cancelamento de Agendamento ⭐ MVP

**User Story**: Como usuária, quero editar ou cancelar agendamentos para lidar com mudanças de última hora.

**Why P1**: Imprescindível para o dia a dia do salão.

**Acceptance Criteria**:

1. WHEN OWNER edita qualquer agendamento THEN sistema SHALL permitir alterar qualquer campo
2. WHEN PARTNER edita agendamento próprio THEN sistema SHALL permitir alterar campos
3. WHEN PARTNER tenta editar agendamento de outra THEN sistema SHALL ocultar/exibir ação desabilitada
4. WHEN usuária cancela agendamento THEN sistema SHALL solicitar confirmação antes de cancelar
5. WHEN agendamento é cancelado THEN sistema SHALL marcar como "cancelado" no histórico e liberar o horário em tempo real na agenda de todas as profissionais
6. WHEN agendamento é editado THEN sistema SHALL notificar a profissional envolvida em tempo real
7. WHEN cancelamento ocorre em horário já passado THEN sistema SHALL manter o horário como ocupado (não reabrir para agendamento)

**Independent Test**: Cancelar agendamento como PARTNER próprio e tentar cancelar de outra.

---

### P2: Bloqueio de Agenda

**User Story**: Como profissional, quero bloquear horários na minha agenda para evitar marcações quando não estiver disponível.

**Why P2**: Essencial para evitar overbooking em dias de folga/intervalos.

**Acceptance Criteria**:

1. WHEN usuária acessa a agenda THEN sistema SHALL exibir opção "Bloquear horário"
2. WHEN usuária seleciona um período THEN sistema SHALL criar bloqueio visualmente distinto (ex: cinza/riscado)
3. WHEN OWNER cria bloqueio THEN sistema SHALL permitir bloquear em qualquer profissional
4. WHEN PARTNER cria bloqueio THEN sistema SHALL permitir bloquear apenas na própria agenda
5. WHEN bloqueio está ativo THEN sistema SHALL impedir criação de agendamentos no período em tempo real (com mensagem "horário bloqueado")
6. WHEN usuária cria bloqueio de dia inteiro THEN sistema SHALL preencher das 00:00 às 23:45
7. WHEN bloqueio é criado/editado/cancelado THEN sistema SHALL refletir em tempo real na agenda de todas as profissionais

**Independent Test**: Criar bloqueio, tentar agendar no mesmo horário, verificar impedimento.

---

### P1: Gestão de Serviços ⭐ MVP

**User Story**: Como profissional, quero cadastrar meus serviços com nome, duração, valor e observações para agilizar o agendamento.

**Why P1**: Agendamentos dependem de serviços para preencher duração e valor automaticamente.

**Acceptance Criteria**:

1. WHEN OWNER acessa serviços THEN sistema SHALL listar serviços de todas as profissionais
2. WHEN OWNER cria/edita/exclui serviço THEN sistema SHALL permitir em qualquer profissional
3. WHEN PARTNER acessa serviços THEN sistema SHALL listar apenas seus próprios serviços
4. WHEN PARTNER cria/edita/exclui serviço THEN sistema SHALL permitir apenas nos próprios serviços
5. WHEN serviço é vinculado a agendamento THEN sistema SHALL bloquear exclusão (desativar em vez de deletar)

**Independent Test**: Criar serviço como PARTNER, verificar que OWNER vê mas outra PARTNER não.

---

### P2: Gestão de Clientes

**User Story**: Como usuária, quero cadastrar e consultar clientes (nome + telefone) para vincular aos agendamentos.

**Why P2**: Necessário para agendar, mas pode fazer cadastro rápido durante o agendamento.

**Acceptance Criteria**:

1. WHEN usuária acessa clientes THEN sistema SHALL listar todos os clientes do salão (visível a todas)
2. WHEN usuária cadastra cliente THEN sistema SHALL exigir nome e telefone (sem email/senha)
3. WHEN usuária busca cliente THEN sistema SHALL permitir busca por nome ou telefone
4. WHEN cliente é vinculado a agendamento THEN sistema SHALL exibir histórico de atendimentos do cliente (datas, serviços, profissional)

**Independent Test**: Cadastrar cliente como PARTNER, verificar que OWNER visualiza.

---

### P2: Notificações Internas

**User Story**: Como profissional, quero receber um aviso no sistema quando um novo agendamento for criado na minha agenda.

**Why P2**: Evita que a profissional precise ficar recarregando a página.

**Acceptance Criteria**:

1. WHEN novo agendamento é criado para profissional X THEN sistema SHALL exibir badge/sino no dashboard de X
2. WHEN novo bloqueio é criado na agenda de profissional X THEN X não precisa ser notificada
3. WHEN agendamento é cancelado/editado THEN sistema SHALL notificar profissional envolvida

**Independent Test**: OWNER cria agendamento para PARTNER, verificar badge no dashboard da PARTNER.

---

### P3: Histórico de Agendamentos

**User Story**: Como usuária, quero consultar agendamentos passados de um cliente para saber o que foi feito anteriormente.

**Why P3**: Útil mas não crítico para o MVP.

**Acceptance Criteria**:

1. WHEN usuária visualiza cliente THEN sistema SHALL exibir timeline de atendimentos anteriores
2. WHEN usuária é PARTNER THEN sistema SHALL exibir apenas os atendimentos que ela realizou para aquele cliente
3. WHEN usuária é OWNER THEN sistema SHALL exibir todos os atendimentos do cliente

**Independent Test**: OWNER vê histórico completo; PARTNER vê só os próprios.

---

### P3: Status de Agendamento

**User Story**: Como profissional, quero marcar o agendamento como "realizado" ou "não compareceu" para controle.

**Why P3**: Útil para relatórios e histórico, mas não bloqueia o fluxo principal.

**Acceptance Criteria**:

1. WHEN agendamento chega ao horário THEN sistema SHALL manter como "confirmado" até ação manual
2. WHEN profissional marca como "realizado" THEN sistema SHALL atualizar status
3. WHEN profissional marca como "não compareceu" THEN sistema SHALL atualizar status
4. WHEN agendamento é cancelado THEN sistema SHALL manter status "cancelado" (não alterável)
5. WHEN OWNER altera status THEN sistema SHALL permitir em qualquer agendamento
6. WHEN PARTNER altera status THEN sistema SHALL permitir apenas nos próprios

**Independent Test**: Avançar status de confirmado → realizado; verificar que PARTNER não altera status de agendamento de outra.

---

### P1: Autoatendimento — Agendamento pelo Cliente ⭐ MVP

**User Story**: Como cliente, quero acessar um link público, informar meu telefone, receber um código de verificação no WhatsApp e agendar um horário com a profissional e serviço que desejo.

**Why P1**: Sua esposa identificou que o maior gargalo é o tempo gasto respondendo WhatsApp para agendar. Autoatendimento libera esse tempo.

**Acceptance Criteria**:

1. WHEN cliente acessa o link público THEN sistema SHALL exibir página com campo para informar telefone
2. WHEN cliente informa telefone válido THEN sistema SHALL enviar código de verificação via WhatsApp (EvolutionAPI) e solicitar confirmação
3. WHEN cliente informa código incorreto THEN sistema SHALL exibir erro e permitir reenviar código (com cooldown de 60s)
4. WHEN cliente confirma telefone com código válido THEN sistema SHALL exibir seleção de profissional (lista de profissionais ativas)
5. WHEN cliente seleciona profissional THEN sistema SHALL exibir serviços daquela profissional com nome, duração e valor
6. WHEN cliente seleciona serviço THEN sistema SHALL exibir calendário com horários disponíveis (excluindo bloqueios e agendamentos ocupados)
7. WHEN cliente seleciona horário THEN sistema SHALL exibir resumo (profissional, serviço, valor, data/hora) e botão "Confirmar Agendamento"
8. WHEN cliente confirma THEN sistema SHALL criar agendamento, vincular cliente (criar se novo) e exibir confirmação na tela
9. WHEN horário selecionado é bloqueado ou ocupado entre a seleção e a confirmação THEN sistema SHALL avisar e sugerir horário alternativo

**Independent Test**: Abrir link público em janela anônima, agendar com novo telefone, verificar agendamento aparece no dashboard da profissional.

---

### P1: Autoatendimento — Cliente vê e cancela próprios agendamentos ⭐ MVP

**User Story**: Como cliente, quero acessar meus agendamentos com meu telefone e cancelar se precisar.

**Why P1**: Cliente precisa ter autonomia para cancelar sem precisar ligar/mandar WhatsApp.

**Acceptance Criteria**:

1. WHEN cliente acessa "Meus Agendamentos" e informa telefone + código WhatsApp THEN sistema SHALL listar todos os agendamentos futuros daquele cliente
 2. WHEN cliente seleciona um agendamento futuro para cancelar THEN sistema SHALL solicitar confirmação e cancelar
3. WHEN cliente confirma cancelamento THEN sistema SHALL cancelar o agendamento e liberar o horário em tempo real
4. WHEN cliente tenta cancelar agendamento passado THEN sistema SHALL exibir "agendamento já realizado"
5. WHEN telefone não possui agendamentos THEN sistema SHALL exibir mensagem "Nenhum agendamento encontrado"

**Independent Test**: Agendar como cliente, depois cancelar. Verificar horário liberado no dashboard.

---

## Edge Cases

- WHEN telefone já cadastrado tenta criar novo cliente THEN sistema SHALL sugerir cliente existente
- WHEN usuária tenta bloquear horário já bloqueado THEN sistema SHALL exibir aviso "período já bloqueado"
- WHEN usuária tenta bloquear horário com agendamento ativo THEN sistema SHALL exibir aviso "há agendamentos neste período"
- WHEN PARTNER tenta acessar rota de administração financeira THEN sistema SHALL redirecionar ou negar (403)
- WHEN sessão expira THEN sistema SHALL redirecionar ao login sem perder dados não salvos
- WHEN conexão em tempo real é perdida THEN sistema SHALL reconectar automaticamente e sincronizar eventos perdidos
- WHEN horário de agendamento já passou THEN sistema SHALL impedir edição e permitir apenas alteração de status (realizado/não compareceu)
- WHEN cliente tenta agendar com telefone já cadastrado para outro cliente THEN sistema SHALL sugerir "já é cliente! Confirme seus dados"
- WHEN EvolutionAPI está indisponível THEN sistema SHALL exibir "serviço temporariamente indisponível" e logar erro (sem travar o sistema para usuários logados)
- WHEN telefone informado pelo cliente é inválido (formato) THEN sistema SHALL exibir erro de validação antes de tentar enviar código

---

## Requirement Traceability

| Requirement ID | Story                         | Phase  | Status  |
| -------------- | ----------------------------- | ------ | ------- |
| AUTH-01        | P1: Autenticação e Controle   | Spec   | Pending |
| AUTH-02        | P1: Autenticação e Controle   | Spec   | Pending |
| AUTH-03        | P1: Autenticação e Controle   | Spec   | Pending |
| AUTH-04        | P1: Autenticação e Controle   | Spec   | Pending |
| AGENDA-01      | P1: Visualização da Agenda    | Spec   | Pending |
| AGENDA-02      | P1: Visualização da Agenda    | Spec   | Pending |
| AGENDA-03      | P1: Visualização da Agenda    | Spec   | Pending |
| AGENDA-04      | P1: Visualização da Agenda    | Spec   | Pending |
| AGENDA-05      | P1: Visualização da Agenda    | Spec   | Pending |
| AGENDA-06      | P1: Visualização da Agenda    | Spec   | Pending |
| AGEND-01       | P1: Criação de Agendamento    | Spec   | Pending |
| AGEND-02       | P1: Criação de Agendamento    | Spec   | Pending |
| AGEND-03       | P1: Criação de Agendamento    | Spec   | Pending |
| AGEND-04       | P1: Criação de Agendamento    | Spec   | Pending |
| AGEND-05       | P1: Criação de Agendamento    | Spec   | Pending |
| AGEND-06       | P1: Criação de Agendamento    | Spec   | Pending |
| AGEND-07       | P1: Criação de Agendamento    | Spec   | Pending |
| AGEND-08       | P1: Criação de Agendamento    | Spec   | Pending |
| EDIT-01        | P1: Edição e Cancelamento     | Spec   | Pending |
| EDIT-02        | P1: Edição e Cancelamento     | Spec   | Pending |
| EDIT-03        | P1: Edição e Cancelamento     | Spec   | Pending |
| EDIT-04        | P1: Edição e Cancelamento     | Spec   | Pending |
| EDIT-05        | P1: Edição e Cancelamento     | Spec   | Pending |
| EDIT-06        | P1: Edição e Cancelamento     | Spec   | Pending |
| EDIT-07        | P1: Edição e Cancelamento     | Spec   | Pending |
| BLOCK-01       | P2: Bloqueio de Agenda        | Spec   | Pending |
| BLOCK-02       | P2: Bloqueio de Agenda        | Spec   | Pending |
| BLOCK-03       | P2: Bloqueio de Agenda        | Spec   | Pending |
| BLOCK-04       | P2: Bloqueio de Agenda        | Spec   | Pending |
| BLOCK-05       | P2: Bloqueio de Agenda        | Spec   | Pending |
| BLOCK-06       | P2: Bloqueio de Agenda        | Spec   | Pending |
| BLOCK-07       | P2: Bloqueio de Agenda        | Spec   | Pending |
| SERV-01        | P1: Gestão de Serviços        | Spec   | Pending |
| SERV-02        | P1: Gestão de Serviços        | Spec   | Pending |
| SERV-03        | P1: Gestão de Serviços        | Spec   | Pending |
| SERV-04        | P1: Gestão de Serviços        | Spec   | Pending |
| SERV-05        | P1: Gestão de Serviços        | Spec   | Pending |
| CLIENT-01      | P2: Gestão de Clientes        | Spec   | Pending |
| CLIENT-02      | P2: Gestão de Clientes        | Spec   | Pending |
| CLIENT-03      | P2: Gestão de Clientes        | Spec   | Pending |
| CLIENT-04      | P2: Gestão de Clientes        | Spec   | Pending |
| NOTIF-01       | P2: Notificações Internas     | Spec   | Pending |
| NOTIF-02       | P2: Notificações Internas     | Spec   | Pending |
| NOTIF-03       | P2: Notificações Internas     | Spec   | Pending |
| HIST-01        | P3: Histórico de Agendamentos | Spec   | Pending |
| HIST-02        | P3: Histórico de Agendamentos | Spec   | Pending |
| HIST-03        | P3: Histórico de Agendamentos | Spec   | Pending |
| STATUS-01      | P3: Status de Agendamento     | Spec   | Pending |
| STATUS-02      | P3: Status de Agendamento     | Spec   | Pending |
| STATUS-03      | P3: Status de Agendamento     | Spec   | Pending |
| STATUS-04      | P3: Status de Agendamento     | Spec   | Pending |
| STATUS-05      | P3: Status de Agendamento     | Spec   | Pending |
| STATUS-06      | P3: Status de Agendamento     | Spec   | Pending |
| SELF-01        | P1: Autoatendimento — Agendamento       | Spec   | Pending |
| SELF-02        | P1: Autoatendimento — Agendamento       | Spec   | Pending |
| SELF-03        | P1: Autoatendimento — Agendamento       | Spec   | Pending |
| SELF-04        | P1: Autoatendimento — Agendamento       | Spec   | Pending |
| SELF-05        | P1: Autoatendimento — Agendamento       | Spec   | Pending |
| SELF-06        | P1: Autoatendimento — Agendamento       | Spec   | Pending |
| SELF-07        | P1: Autoatendimento — Agendamento       | Spec   | Pending |
| SELF-08        | P1: Autoatendimento — Agendamento       | Spec   | Pending |
| SELF-09        | P1: Autoatendimento — Agendamento       | Spec   | Pending |
| SELF-MGMT-01   | P1: Autoatendimento — Gerenciamento     | Spec   | Pending |
| SELF-MGMT-02   | P1: Autoatendimento — Gerenciamento     | Spec   | Pending |
| SELF-MGMT-03   | P1: Autoatendimento — Gerenciamento     | Spec   | Pending |
| SELF-MGMT-04   | P1: Autoatendimento — Gerenciamento     | Spec   | Pending |
| SELF-MGMT-05   | P1: Autoatendimento — Gerenciamento     | Spec   | Pending |
| EDGE-01        | Edge Cases                           | Spec   | Pending |
| EDGE-02        | Edge Cases                             | Spec   | Pending |
| EDGE-03        | Edge Cases                             | Spec   | Pending |
| EDGE-04        | Edge Cases                             | Spec   | Pending |
| EDGE-05        | Edge Cases                             | Spec   | Pending |
| EDGE-06        | Edge Cases                             | Spec   | Pending |
| EDGE-07        | Edge Cases                             | Spec   | Pending |
| EDGE-08        | Edge Cases                             | Spec   | Pending |
| EDGE-09        | Edge Cases                             | Spec   | Pending |
| EDGE-10        | Edge Cases                             | Spec   | Pending |
| EDGE-11        | Edge Cases                             | Spec   | Pending |

**Coverage:** 83 total, 0 mapped to tasks, 83 unmapped ⚠️

---

## Success Criteria

- [ ] OWNER consegue criar agendamento para PARTNER em < 30 segundos
- [ ] PARTNER vê corretamente apenas seus próprios valores financeiros
- [ ] Conflito de horário gera aviso visível antes de confirmar agendamento
- [ ] Bloqueio impede agendamento no período
- [ ] Cancelamento libera horário em tempo real para todas as profissionais

---

## Technical Notes

- **RBAC**: CASL.js para gerenciamento de permissões (roles: OWNER, PARTNER, CLIENT)
- **UI Framework**: Nuxt 3 com TailwindCSS (landing page + autoatendimento) e Vuetify (dashboard). `routeRules` define SSR/SPA por rota.
- **Autenticação profissionais**: Telefone + senha. Cadastro com Nome Completo, CPF, Telefone, Senha.
- **Autenticação clientes**: Telefone + código WhatsApp (EvolutionAPI).
- **Normalização de telefone**: Armazenar apenas dígitos (DDD + número, 10-11 chars) sem prefixo 55. Backend adiciona +55 para EvolutionAPI. Zod transform limpa input. Frontend usa máscara só para exibição.
- **Tempo real**: SSE (Server-Sent Events) unidirecional, exclusivo para o dashboard profissional. Cliente (autoatendimento) usa REST puro.
- **Verificação WhatsApp**: EvolutionAPI — escopo mínimo (apenas envio de código de verificação, sem bot conversacional)
- **Concorrência**: `db.transaction()` no Drizzle com checagem de disponibilidade imediatamente antes do insert. SELECT de verificação + INSERT na mesma transação. Retorna 409 em caso de conflito.
- **Autenticação**: Duplo cookie HTTP-Only — `access_token` (15 min) + `refresh_token` (30 dias). SSE autentica via cookie (EventSource não envia headers). Nuxt com interceptor global de refresh.
- **Infraestrutura**: Docker Compose (dev). Deploy em Oracle Cloud apenas após validação com a proprietária.
- **Database**: PostgreSQL nativo via container. `prepare: true` no postgres.js (prepared statements ativos).
- **Arquitetura**: Nuxt 3 — `/` SSR (Tailwind), `/dashboard/**` SPA (Vuetify), `/agendar/**` SPA (Tailwind)
- **Pastas**: Monorepo com `api/` (Fastify) e `web/` (Nuxt 3)
- **Seed**: Script de migração inicial que cria conta OWNER (admin). A proprietária cadastra parceiras e serviços depois.

```ts
// web/nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'vuetify-nuxt-module'],
  routeRules: {
    '/': { ssr: true },               // Landing — Tailwind CSS
    '/dashboard/**': { ssr: false },  // Dashboard — Vuetify
    '/agendar/**': { ssr: false },    // Booking — Tailwind CSS
  },
})
```

