# Landing Page — Design

## Architecture

### Component Tree

```
pages/index.vue
└── LandingLayout (wrapper que importa todos os blocos)
    ├── LNavbar          — Navbar fixa com logo, links, CTA, menu mobile
    ├── LHero            — Hero com imagem bg, overlay, textos, CTAs, widget flutuante
    ├── LPillars         — 3 pilares de assinatura (ícone + título + descrição)
    ├── LMosaic          — Quem Somos (fotos + texto institucional)
    ├── LTestimonials    — Depoimentos (carrossel de clientes)
    ├── LArtists         — Profissionais (dinâmico via API)
    ├── LCTABanner       — Faixa escura "Agende Seu Horário" com CTA
    ├── LServices        — Grid de serviços (cards com imagem, título, descrição)
    ├── LWhyChooseUs     — Métricas + diferenciais
    ├── LGallery         — Galeria de fotos do salão
    └── LFooter          — Rodapé completo (contato, horários, redes)
```

### Data Flow

```
index.vue (useAsyncData)
  ├── LArtists → GET /api/booking/professionals (useFetch SSR)
  └── Demais componentes → conteúdo estático / props (depoimentos com fotos em /testimonials/)
```

---

## Implementation Notes (pós-implementação)

### LTestimonials
- **Data:** Array estático de 6 depoimentos, com campo `photo` opcional
- **Interaction:** Carrossel com setas de navegação + navegação infinita (array triplicado)
- **Author alignment:** Card usa `flex flex-col` + `mt-auto` no autor para alinhamento ao fundo
- **Photos:** 3 depoimentos com fotos em `packages/landing/public/testimonials/`
- **Fallback:** Inicial do nome em avatar circular quando `photo` não existe

### Paths atualizados
- Componentes em `packages/landing/app/components/`
- Páginas em `packages/landing/app/pages/`
- Assets em `packages/landing/app/assets/`
- Público em `packages/landing/public/`

---

### Route Rules

```ts
// nuxt.config.ts — já configurado
'/' → { prerender: true }  // SSR estático para SEO
```

## Component Specifications

### LNavbar
- **Props:** none
- **State:** `isMobileMenuOpen` (local)
- **Sections:** Logo (esquerda), NavLinks (centro), Botão Agendar (direita)
- **Mobile:** Hamburger icon → drawer com links verticais
- **Scroll:** `position: fixed` com `bg-background/90 backdrop-blur-md` no scroll
- **Links:** #hero, #about, #services, #artists, #testimonials, #location

### LHero
- **Props:** none
- **Structure:** `min-h-[80vh]` bg image + overlay escuro + conteúdo alinhado à esquerda
- **Content:** Headline, subtítulo, 2 botões CTA, widget flutuante (avatares)
- **Image:** Placeholder de salão premium (unsplash ou picsum)
- **Fallback:** Cor sólida escura se imagem não carregar

### LPillars
- **Props:** none
- **Data:** Array estático de 3 objetos `{ icon, title, description, cta }`
- **Themes:** "Nosso Salão", "Amamos Atender", "Vale Presente"

### LMosaic
- **Props:** none
- **Layout:** 2 colunas (lg) — fotos (esq) + texto (dir)
- **Content:** História do Studio Blessed (do legado React)

### LTestimonials
- **Props:** none
- **Data:** Array estático de depoimentos (do legado React)
- **Interaction:** Carrossel com setas de navegação (CSS/JS puro ou Vue carousel)

### LArtists
- **Props:** none
- **Data:** `useFetch('/api/booking/professionals')` com SSR
- **Fallback:** Mensagem estática se API offlines
- **Display:** Grid de cards com foto, nome, especialidade

### LCTABanner
- **Props:** none
- **Content:** Título "Agende Seu Horário" + botão "Agendar Agora"
- **Style:** `bg-dark` com `text-white`, layout flex horizontal

### LServices
- **Props:** none
- **Data:** Array estático dos serviços do Studio Blessed (do legado)
- **Display:** Grid 3 colunas (1 em mobile) com cards imagem + título + descrição + CTA

### LWhyChooseUs
- **Props:** none
- **Structure:** 2 metades — contadores (esq) + grid diferenciais (dir)

### LGallery
- **Props:** none
- **Display:** Grid de fotos do salão (placeholder)

### LFooter
- **Props:** none
- **Content:** Logo, navegação, contato (tel + Instagram + endereço), horários, copyright

## Tailwind Theme

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      'sb-white': '#F1F1F1',
      'sb-dark': '#130F0E',
      'sb-primary': '#A78B58',
      'sb-primary-light': '#D9C49E',
      'sb-primary-dark': '#735826',
      'sb-warm': '#4F4B40',
      'sb-sand': '#DACDB6',
    },
    fontFamily: {
      serif: ['Playfair Display', 'Georgia', 'serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
      cursive: ['Dancing Script', 'cursive'],
    },
  },
}
```

Color tokens semânticos mapeados:
| Token | Tailwind Class | Hex |
|-------|---------------|-----|
| `bg-background` | `bg-sb-white` | #F1F1F1 |
| `text-foreground` | `text-sb-dark` | #130F0E |
| `text-accent` | `text-sb-primary` | #A78B58 |
| `bg-dark` | `bg-sb-dark` | #130F0E |
| `text-dark` | `text-sb-dark` | #130F0E |
| `text-muted` | `text-sb-warm` | #4F4B40 |
| `border` | `border-sb-sand` | #DACDB6 |

## Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| < 768px (mobile) | Single column, hamburger menu, stacked grids |
| 768px - 1024px (tablet) | 2 columns grids, horizontal nav |
| > 1024px (desktop) | Full layout as specified |

## Performance Considerations

- Todas imagens com `loading="lazy"` exceto hero
- Hero image com `priority` e preload hint
- Google Maps com `loading="lazy"`
- API de profissionais com SSR cache (staleTime no TanStack Query)
- Fonte(s) carregadas via `@fontsource` ou Google Fonts com `display=swap`
