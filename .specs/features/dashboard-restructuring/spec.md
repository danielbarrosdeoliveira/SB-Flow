# Dashboard DDD Restructuring Specification

## Problem Statement

O package `dashboard` atualmente utiliza organização plana por tipo de arquivo (composables/, pages/, stores/, etc.), dificultando a escalabilidade e a separação de responsabilidades por domínio de negócio. A migração para estrutura DDD (Domain-Driven Design) por domínio melhora a manutenibilidade, coesão e clareza do código.

## Goals

- [ ] Estruturar `packages/dashboard/app/` sob `app/features/{domain}/` com separação clara por domínio de negócio
- [ ] Manter compatibilidade total com auto-imports do Nuxt (composables, components, utils)
- [ ] Preservar toda funcionalidade existente durante a migração
- [ ] Implementar estrutura que facilite adição de novos domínios no futuro

## Out of Scope

- Modificar lógica de negócio existente (apenas reorganização de arquivos)
- Alterar API backend ou contratos
- Migrations de banco de dados
- Criar novos componentes ou features

---

## Domínios Identificados

| Domínio | Descrição | Arquivos Originais |
|---------|-----------|-------------------|
| **auth** | Autenticação e autorização | stores/auth.ts, middleware/auth.ts, pages/login.vue |
| **clients** | Gestão de clientes | composables/use-clients.ts, pages/dashboard/clientes.vue |
| **appointments** | Gestão de agendamentos | composables/use-appointments.ts, pages/dashboard/agenda.vue, features/dashboard/components/AppointmentsCard.vue |
| **treatments** | Gestão de tratamentos/serviços | composables/use-treatments.ts, pages/dashboard/servicos.vue |
| **professionals** | Gestão de profissionais | pages/dashboard/profissionais.vue |
| **dashboard** | Layout e estrutura base | layouts/dashboard.vue, pages/index.vue |
| **shared** | Utilitários globais | utils/*.ts, stores/layout.ts, plugins/vue-query.ts, composables/use-*.ts restantes |

---

## Estrutura Alvo

```
packages/dashboard/
├── app/
│   ├── app.config.ts
│   ├── app.vue
│   ├── assets/css/main.css
│   │
│   ├── features/                          # Domínios DDD
│   │   ├── auth/
│   │   │   ├── middleware/auth.ts
│   │   │   ├── pages/login.vue
│   │   │   └── stores/auth.ts
│   │   │
│   │   ├── clients/
│   │   │   ├── composables/use-clients.ts
│   │   │   └── pages/clientes.vue
│   │   │
│   │   ├── appointments/
│   │   │   ├── components/AppointmentsCard.vue
│   │   │   ├── composables/use-appointments.ts
│   │   │   └── pages/agenda.vue
│   │   │
│   │   ├── treatments/
│   │   │   ├── composables/use-treatments.ts
│   │   │   └── pages/servicos.vue
│   │   │
│   │   ├── professionals/
│   │   │   └── pages/profissionais.vue
│   │   │
│   │   └── dashboard/
│   │       ├── layouts/dashboard.vue
│   │       └── pages/index.vue
│   │
│   ├── shared/                            # Infraestrutura compartilhada
│   │   ├── composables/
│   │   │   ├── use-sse.ts
│   │   │   ├── use-user-profile.ts
│   │   │   └── (use-appointments, use-clients, use-treatments migram para features)
│   │   ├── stores/
│   │   │   └── layout.ts
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   └── phone.ts
│   │   └── plugins/
│   │       └── vue-query.ts
│   │
│   └── components/                        # Componentes globais (fallback Nuxt)
│
├── nuxt.config.ts                         # Atualizado com dirs.app para features
├── package.json
└── tsconfig.json
```

---

## User Stories

### P1: Migração de Estrutura

**User Story**: Como desenvolvedor, quero que o dashboard seja organizado por domínio de negócio para facilitar localização de código e manutenção.

**Why P1**: Estrutura base para todo desenvolvimento futuro.

**Acceptance Criteria**:

1. WHEN todos os arquivos forem migrados THEN a estrutura `app/features/{domain}/` SHALL estar completa
2. WHEN nuxt dev for executado THEN o app SHALL carregar sem erros de import
3. WHEN composables forem usados em qualquer feature THEN SHALL funcionar auto-import
4. WHEN componentes forem usados THEN SHALL funcionar auto-import

---

## Nuxt Auto-Import Compatibility

### Desafio

Nuxt 4 Conventions para auto-imports:
- `~/composables/*` → auto-import composables
- `~/components/*` → auto-import components  
- `~/stores/*` → Pinia stores (via @pinia/nuxt)
- `~/middleware/*` → route middleware
- `~/utils/*` → auto-import utilities

### Solução

Ajustar `nuxt.config.ts` com:

```ts
future: {
  compatibilityVersion: 4,
},
_dir: {
  app: 'app',           // srcDir
  features: 'features', // dentro de app/
},
components: [
  { 
    path: '~/components',
    pathPrefix: false,
  },
  {
    path: '~/features/*/components',
    pathPrefix: false,
  },
],
dirs: {
  composables: [
    '~/composables',
    '~/features/*/composables',
  ],
  stores: [
    '~/stores',
    '~/features/*/stores',
  ],
  utils: [
    '~/utils',
    '~/features/*/utils',
  ],
},
```

---

## Regras de Nomeação

1. **Páginas**: `kebab-case.vue` (ex: `clientes.vue`, `agenda.vue`)
2. **Componentes**: `PascalCase.vue` (ex: `AppointmentsCard.vue`)
3. **Composables**: `use-{noun}.ts` (ex: `use-clients.ts`)
4. **Stores**: `{noun}.ts` (ex: `auth.ts`, `layout.ts`)
5. **Utils**: `kebab-case.ts` (ex: `api.ts`, `phone.ts`)

---

## Requisitos de Migração

| ID | Descrição | Depende de |
|----|-----------|------------|
| DDD-01 | Criar estrutura de diretórios features/ | - |
| DDD-02 | Migrar auth domain (middleware, store, page) | DDD-01 |
| DDD-03 | Migrar clients domain (composable, page) | DDD-01 |
| DDD-04 | Migrar appointments domain (composable, page, component) | DDD-01 |
| DDD-05 | Migrar treatments domain (composable, page) | DDD-01 |
| DDD-06 | Migrar professionals domain (page) | DDD-01 |
| DDD-07 | Migrar dashboard domain (layout, page) | DDD-01 |
| DDD-08 | Consolidar shared/ (utils, plugins, remaining composables) | DDD-02-07 |
| DDD-09 | Atualizar nuxt.config.ts para paths de features | DDD-01 |
| DDD-10 | Verificar dev server funciona | DDD-09 |
| DDD-11 | typecheck passa | DDD-10 |

---

## Success Criteria

- [ ] Estrutura `app/features/{domain}/` implementada
- [ ] `npm run dev` executa sem erros
- [ ] `npm run typecheck` passa com 0 erros
- [ ] Navegação entre todas as páginas funciona (login → dashboard → todas as páginas)
- [ ] Composables auto-importados funcionam em todos os domínios
- [ ] Components auto-importados funcionam em todos os domínios