# SB-Flow — Architecture & Roadmap

## Domínios (Produção)

Cada pacote é um projeto Nuxt independente, deployado separadamente em seu próprio subdomínio.

| Domínio | Pacote | Framework | Renderização | Finalidade |
|---------|--------|-----------|-------------|-----------|
| `blessedstudio.com.br` | `packages/landing` | Nuxt 4 + Tailwind CSS | SSR | Landing Page institucional |
| `dashboard.blessedstudio.com.br` | `packages/dashboard` | Nuxt 4 + Nuxt UI | SPA | Dashboard administrativo |
| `booking.blessedstudio.com.br` | `packages/booking` | Nuxt 4 + Tailwind CSS | SPA | Autoatendimento do cliente |

## Landing Package — Rotas

| Caminho | Descrição |
|---------|-----------|
| `/` | Home institucional (SSR) |

## Dashboard Package — Rotas

| Caminho | Descrição |
|---------|-----------|
| `/login` | Login |
| `/dashboard/` | Painel inicial com KPIs e navegação |
| `/dashboard/agenda` | Agenda do dia |
| `/dashboard/clientes` | CRUD de clientes |
| `/dashboard/profissionais` | CRUD de profissionais |
| `/dashboard/servicos` | CRUD de serviços |

## Booking Package — Rotas

| Caminho | Descrição |
|---------|-----------|
| `/` | Booking multi-step — cliente seleciona profissional, serviço, data/hora |

## Stack

- **API**: `api/` — Fastify + Drizzle + PostgreSQL
- **Landing**: `packages/landing` — Nuxt 4 + Tailwind CSS
- **Dashboard**: `packages/dashboard` — Nuxt 4 + Nuxt UI + Pinia + `@tanstack/vue-query`
- **Booking**: `packages/booking` — Nuxt 4 + Tailwind CSS

## Separação de Estado (Frontend)

Conforme `.specs/codebase/CONVENTIONS.md`:

- **Pinia** → apenas estado de UI e sessão (sidebar, auth, preferências)
- **TanStack Query** → todo dado de servidor (agendamentos, clientes, profissionais, serviços)

## Separação de Estilos

- Landing e Booking usam **Tailwind CSS** com cores customizadas `sb-*`
- Dashboard usa **Nuxt UI** (Tailwind CSS nativo gerenciado pelo módulo)
- Cada pacote é independente — não há conflito de estilos entre eles

## Scripts

```bash
npm run dev:api        # API Fastify — porta 3001
npm run dev:dashboard  # Dashboard — porta 3000
npm run dev:landing    # Landing — porta 3000 (use -p se ocupada)
npm run dev:booking    # Booking — porta 3000 (use -p se ocupada)
```

## Próximos Passos

- [ ] Configurar subdomínios no provider (Vercel/Cloudflare)
- [ ] CI/CD para deploy separado dos pacotes
- [ ] BOOKING-09 a 14: notificações, histórico, status, relatórios, calendário
