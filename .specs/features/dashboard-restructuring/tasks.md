# Dashboard DDD Restructuring Tasks

**Design**: `.specs/features/dashboard-restructuring/design.md`
**Status**: Draft

---

## Execution Plan

### Phase 1: Foundation (Sequential)

Criação da estrutura base e migração dos domínios.

```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10
```

### Phase 2: Verification (Sequential)

Testar que tudo funciona após migração.

```
T11 → T12
```

---

## Task Breakdown

### T1: Criar estrutura de diretórios features/

**What**: Criar todos os diretórios `features/{domain}/{subdirs}` conforme especificação
**Where**: `packages/dashboard/app/features/`
**Depends on**: None
**Requirement**: DDD-01

**Tools**:

- MCP: `filesystem`
- Skill: NONE

**Done when**:

- [ ] `features/auth/{stores,middleware,pages}/` criados
- [ ] `features/clients/{composables,pages}/` criados
- [ ] `features/appointments/{composables,pages,components}/` criados
- [ ] `features/services/{composables,pages}/` criados
- [ ] `features/professionals/{pages}/` criados
- [ ] `features/dashboard/{layouts,pages}/` criados
- [ ] `shared/{composables,stores,utils,plugins}/` criados

**Tests**: none
**Gate**: build

---

### T2: Migrar domain auth

**What**: Mover stores/auth.ts, middleware/auth.ts, pages/login.vue para features/auth/
**Where**: `packages/dashboard/app/features/auth/`
**Depends on**: T1
**Requirement**: DDD-02

**Tools**:

- MCP: `filesystem`
- Skill: NONE

**Done when**:

- [ ] `auth/stores/auth.ts` existe com conteúdo original
- [ ] `auth/middleware/auth.ts` existe com conteúdo original
- [ ] `auth/pages/login.vue` existe com conteúdo original
- [ ] Arquivos originais removidos de `app/stores/`, `app/middleware/`, `app/pages/`

**Tests**: none
**Gate**: build

---

### T3: Migrar domain clients

**What**: Mover use-clients.ts e clientes.vue para features/clients/
**Where**: `packages/dashboard/app/features/clients/`
**Depends on**: T1
**Requirement**: DDD-03

**Tools**:

- MCP: `filesystem`
- Skill: NONE

**Done when**:

- [ ] `clients/composables/use-clients.ts` existe com conteúdo original
- [ ] `clients/pages/clientes.vue` existe com conteúdo original
- [ ] Arquivos originais removidos

**Tests**: none
**Gate**: build

---

### T4: Migrar domain appointments

**What**: Mover use-appointments.ts, agenda.vue e AppointmentsCard.vue para features/appointments/
**Where**: `packages/dashboard/app/features/appointments/`
**Depends on**: T1
**Requirement**: DDD-04

**Tools**:

- MCP: `filesystem`
- Skill: NONE

**Done when**:

- [ ] `appointments/composables/use-appointments.ts` existe com conteúdo original
- [ ] `appointments/pages/agenda.vue` existe com conteúdo original
- [ ] `appointments/components/AppointmentsCard.vue` existe com conteúdo original
- [ ] Arquivos originais removidos

**Tests**: none
**Gate**: build

---

### T5: Migrar domain services

**What**: Mover use-services.ts e servicos.vue para features/services/
**Where**: `packages/dashboard/app/features/services/`
**Depends on**: T1
**Requirement**: DDD-05

**Tools**:

- MCP: `filesystem`
- Skill: NONE

**Done when**:

- [ ] `services/composables/use-services.ts` existe com conteúdo original
- [ ] `services/pages/servicos.vue` existe com conteúdo original
- [ ] Arquivos originais removidos

**Tests**: none
**Gate**: build

---

### T6: Migrar domain professionals

**What**: Mover profissionais.vue para features/professionals/
**Where**: `packages/dashboard/app/features/professionals/`
**Depends on**: T1
**Requirement**: DDD-06

**Tools**:

- MCP: `filesystem`
- Skill: NONE

**Done when**:

- [ ] `professionals/pages/profissionais.vue` existe com conteúdo original
- [ ] Arquivo original removido de `app/pages/dashboard/`

**Tests**: none
**Gate**: build

---

### T7: Migrar domain dashboard

**What**: Mover layouts/dashboard.vue e pages/index.vue para features/dashboard/
**Where**: `packages/dashboard/app/features/dashboard/`
**Depends on**: T1
**Requirement**: DDD-07

**Tools**:

- MCP: `filesystem`
- Skill: NONE

**Done when**:

- [ ] `dashboard/layouts/dashboard.vue` existe com conteúdo original
- [ ] `dashboard/pages/index.vue` existe com conteúdo original
- [ ] Arquivos originais removidos

**Tests**: none
**Gate**: build

---

### T8: Consolidar shared/

**What**: Mover utils/, plugins/, e composables restantes (use-sse, use-user-profile) e stores/layout.ts para shared/
**Where**: `packages/dashboard/app/shared/`
**Depends on**: T2-T7
**Requirement**: DDD-08

**Tools**:

- MCP: `filesystem`
- Skill: NONE

**Done when**:

- [ ] `shared/utils/api.ts` e `shared/utils/phone.ts` existem
- [ ] `shared/plugins/vue-query.ts` existe
- [ ] `shared/composables/use-sse.ts` e `use-user-profile.ts` existem
- [ ] `shared/stores/layout.ts` existe
- [ ] Arquivos originais de `app/` removidos

**Tests**: none
**Gate**: build

---

### T9: Atualizar nuxt.config.ts

**What**: Configurar dirs de features para auto-imports funcionarem
**Where**: `packages/dashboard/nuxt.config.ts`
**Depends on**: T1
**Requirement**: DDD-09

**Tools**:

- MCP: `filesystem`
- Skill: NONE

**Done when**:

- [ ] `future.compatibilityVersion: 4` configurado
- [ ] `dirs.composables` inclui `['~/composables', '~/features/*/composables']`
- [ ] `dirs.stores` via pinia config inclui `~/features/*/stores`
- [ ] Componentes de features descobertos via path extra

**Tests**: none
**Gate**: build

---

### T10: Limpar app/ vazio

**What**: Remover diretórios agora vazios em app/ (composables/, stores/, utils/, plugins/, middleware/, pages/dashboard/)
**Where**: `packages/dashboard/app/`
**Depends on**: T2-T8
**Requirement**: DDD-08

**Tools**:

- MCP: `filesystem`
- Skill: NONE

**Done when**:

- [ ] Diretórios vazios removidos
- [ ] `features/`, `shared/`, `components/`, `layouts/`, `pages/`, `plugins/`, `assets/` permanecem

**Tests**: none
**Gate**: build

---

### T11: Verificar typecheck

**What**: Executar npm run typecheck para garantir que tipos estão corretos
**Where**: `packages/dashboard/`
**Depends on**: T9, T10
**Requirement**: DDD-11

**Tools**:

- MCP: `bash`
- Skill: NONE

**Done when**:

- [ ] `npm run typecheck` passa com 0 erros
- [ ] Nenhum import quebrado

**Tests**: none
**Gate**: full

**Verify**:
```bash
cd packages/dashboard && npm run typecheck
```
**Expected**: Saída sem erros TypeScript

---

### T12: Verificar dev server

**What**: Executar npm run dev e verificar que app inicia
**Where**: `packages/dashboard/`
**Depends on**: T9, T10
**Requirement**: DDD-10

**Tools**:

- MCP: `bash`
- Skill: NONE

**Done when**:

- [ ] `npm run dev` inicia sem erros
- [ ] Servidor responde na porta configurada

**Tests**: none
**Gate**: full

**Verify**:
```bash
cd packages/dashboard && timeout 30 npm run dev
```
**Expected**: "Nuxi initialization complete" ou similar

---

## Parallel Execution Map

```
Phase 1 (Sequential):
  T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10

Phase 2 (Sequential):
  T11 → T12
```

**Nota**: Todas as migrações (T2-T8) dependem apenas de T1 (estrutura criada) e podem teoricamente ser paralelas, mas para evitar conflitos de I/O e manter clareza, executamos sequencialmente.

---

## Task Granularity Check

| Task | Scope | Status |
|------|-------|--------|
| T1: Criar dirs | 1 operação mkdir | ✅ Granular |
| T2: Migrar auth | 3 arquivos | ✅ Granular |
| T3: Migrar clients | 2 arquivos | ✅ Granular |
| T4: Migrar appointments | 3 arquivos | ✅ Granular |
| T5: Migrar services | 2 arquivos | ✅ Granular |
| T6: Migrar professionals | 1 arquivo | ✅ Granular |
| T7: Migrar dashboard | 2 arquivos | ✅ Granular |
| T8: Consolidar shared | 6 arquivos | ✅ Granular |
| T9: nuxt.config | 1 arquivo config | ✅ Granular |
| T10: Limpar vazios | Multiple rm | ✅ Granular |
| T11: typecheck | 1 comando | ✅ Granular |
| T12: dev server | 1 comando | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
|------|----------------------|---------------|--------|
| T1 | None | (起点) | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T1 | T1 → T3 | ✅ Match |
| T4 | T1 | T1 → T4 | ✅ Match |
| T5 | T1 | T1 → T5 | ✅ Match |
| T6 | T1 | T1 → T6 | ✅ Match |
| T7 | T1 | T1 → T7 | ✅ Match |
| T8 | T2-T7 | T7 → T8 | ✅ Match |
| T9 | T1 | T1 → T9 | ✅ Match |
| T10 | T2-T8 | T8 → T10 | ✅ Match |
| T11 | T9, T10 | T10 → T11 | ✅ Match |
| T12 | T9, T10 | T10 → T12 | ✅ Match |

---

## Success Criteria

- [ ] T1-T10: Todos os arquivos migrados para estrutura DDD
- [ ] T11: `npm run typecheck` passa
- [ ] T12: `npm run dev` inicia corretamente
- [ ] Estrutura `app/features/{domain}/` e `app/shared/` implementada