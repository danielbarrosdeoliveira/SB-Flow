# SB-Flow — Architecture & Roadmap

## Domínios (Produção)

| Domínio | Pacote | Framework | SSR | Finalidade |
|---|---|---|---|---|
| `studioblessed.com.br` | `packages/landing` | Nuxt 3 + Tailwind CSS | ✅ SSR | Landing Page institucional |
| `agenda.studioblessed.com.br` | `packages/landing` | Nuxt 3 + Tailwind CSS | ❌ SPA | Área de Agendamento do Cliente |
| `app.studioblessed.com.br` | `packages/dashboard` | Nuxt 3 + Vuetify | ❌ SPA | Dashboard administrativo |

## Landing Package — Rotas

| Caminho | Subdomínio | Descrição |
|---|---|---|
| `/` | `studioblessed.com.br` | Home institucional (prerender) |
| `/agendar` | `agenda.studioblessed.com.br` | Booking multi-step — cliente seleciona profissional, serviço, data/hora |

### Deploy (Vercel / Cloudflare)

- Landing + Agenda: um mesmo build Nuxt, deploy em dois subdomínios separados por regra de rota.
- Na Vercel: `studioblessed.com.br` aponta para o projeto landing; `agenda.studioblessed.com.br` também aponta para o mesmo projeto, com rota raiz servindo `/agendar`.
- No `nuxt.config.ts`, a regra `routeRules: { "/agendar": { ssr: false } }` garante que a página de agendamento rode como SPA (sem SSR) para melhor interatividade.

## Dashboard Package — Rotas

| Caminho | Subdomínio | Descrição |
|---|---|---|
| `/login` | `app.studioblessed.com.br` | Login (Vuetify) |
| `/dashboard/agenda` | `app.studioblessed.com.br` | Agenda do dia |
| `/dashboard/clientes` | `app.studioblessed.com.br` | CRUD de clientes |
| `/dashboard/profissionais` | `app.studioblessed.com.br` | CRUD de profissionais |
| `/dashboard/servicos` | `app.studioblessed.com.br` | CRUD de serviços |

## Stack

- **API**: `api/` — Express + Drizzle + SQLite (separado, fora dos pacotes Nuxt)
- **Landing**: Nuxt 3 + `@nuxtjs/tailwindcss` + `nuxt-icon` + `@tanstack/vue-query`
- **Dashboard**: Nuxt 3 + `vuetify-nuxt-module` + `@pinia/nuxt` + `@tanstack/vue-query` + `zod`

## Separação de Estilos

- Landing usa **Tailwind CSS** com cores customizadas `sb-*` (gold/warm) definidas no `tailwind.config.ts` e tokens em `assets/css/tokens.css`
- Dashboard usa **Vuetify** com tema customizado (cores sb-* mapeadas no tema Vuetify)
- Nenhum pacote importa o CSS do outro — estilos isolados desde o build

## Scripts

```bash
npm run dev:landing    # Landing + Agenda (localhost:3000)
npm run dev:dashboard  # Dashboard (localhost:3000 — use -p 3001 se precisar)
npm run dev:api        # API
```

## Próximos Passos

- [ ] Implementar autenticação na landing (para cliente consultar agendamentos)
- [ ] Adicionar página "Meus Agendamentos" no landing
- [ ] Configurar subdomínios no provider (Vercel/Cloudflare)
- [ ] CI/CD para deploy separado dos pacotes
