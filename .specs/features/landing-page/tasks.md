# Landing Page — Tasks

**Status:** ✅ Todas as tasks concluídas

---

## Setup (pré-requisito)

| ID | Task | Depends On | Verification | Status |
|----|------|-----------|-------------|--------|
| LP-SETUP-01 | Instalar `@nuxtjs/tailwindcss` e configurar tema com paleta Studio Blessed | - | `npm run dev` não mostra erro de classe Tailwind | ✅ |
| LP-SETUP-02 | Configurar fontes (Google Fonts: Playfair Display, Inter, Dancing Script) no Nuxt head | LP-SETUP-01 | Fontes carregam no navegador | ✅ |

## Implementação

| ID | Task | Depends On | Verification | Status |
|----|------|-----------|-------------|--------|
| LP-COMP-01 | Criar `LNavbar.vue` — nav fixa, logo, links, botão CTA, menu mobile hamburguer | LP-SETUP-01, LP-SETUP-02 | Navbar aparece fixa, links navegam por âncora, mobile menu funciona | ✅ |
| LP-COMP-02 | Criar `LHero.vue` — hero com imagem bg, overlay, textos, CTAs, widget avatares | LP-SETUP-01 | Hero ocupa 80vh, textos visíveis, CTAs funcionam | ✅ |
| LP-COMP-03 | Criar `LPillars.vue` — 3 pilares com ícone, título, descrição | LP-SETUP-01 | Grid 3 colunas com conteúdo | ✅ |
| LP-COMP-04 | Criar `LMosaic.vue` — Quem Somos com fotos + texto institucional | LP-SETUP-01 | Layout 2 colunas com fotos e história | ✅ |
| LP-COMP-05 | Criar `LTestimonials.vue` — carrossel de depoimentos | LP-SETUP-01 | Carrossel navegável com depoimentos | ✅ |
| LP-COMP-06 | Criar `LArtists.vue` — grid de profissionais via API com fallback | LP-SETUP-01 | API chamada no SSR, fallback se offline | ✅ |
| LP-COMP-07 | Criar `LCTABanner.vue` — faixa CTA escura | LP-SETUP-01 | Banner com botão funcional | ✅ |
| LP-COMP-08 | Criar `LServices.vue` — grid de serviços | LP-SETUP-01 | 3 cards de serviço com imagem e CTA | ✅ |
| LP-COMP-09 | Criar `LWhyChooseUs.vue` — métricas + diferenciais | LP-SETUP-01 | Layout 2 metades com contadores | ✅ |
| LP-COMP-10 | Criar `LGallery.vue` — galeria de fotos | LP-SETUP-01 | Grid de imagens | ✅ |
| LP-COMP-11 | Criar `LFooter.vue` — rodapé completo | LP-SETUP-01 | Footer com logo, links, contato, horários, copyright | ✅ |
| LP-PAGE-01 | Substituir `pages/index.vue` — importar todos componentes na ordem | LP-COMP-01 a LP-COMP-11 | Página renderiza todas as seções em SSR | ✅ |
| LP-PAGE-02 | Atualizar `nuxt.config.ts` — app.head title/description SEO | LP-PAGE-01 | Meta tags corretas no HTML | ✅ |

## Refinamentos pós-implementação

| ID | Task | Status |
|----|------|--------|
| LP-REF-01 | Carrossel infinito de depoimentos (sem slides em branco) | ✅ |
| LP-REF-02 | Autor do depoimento alinhado ao final do card | ✅ |
| LP-REF-03 | Fotos nos depoimentos (fallback para inicial quando sem foto) | ✅ |
| LP-REF-04 | Social proof stats atualizados | ✅ |
| LP-REF-05 | Migração para Nuxt 4 app directory | ✅ |
| LP-REF-06 | Monorepo split (packages/landing, packages/dashboard, packages/agenda) | ✅ |
| LP-REF-07 | Atualização de deps (nuxt ^4.4.8, vue-router v5, vue-tsc v3) | ✅ |

## Gate Check (pós implementação)

| ID | Check | Command | Status |
|----|-------|---------|--------|
| LP-GATE-01 | Build sem erros | `npm run build:landing` | ✅ |
| LP-GATE-02 | Typecheck | `npm run typecheck` (landing) | ✅ |
| LP-GATE-03 | Lint | `npm run lint` | ✅ |
