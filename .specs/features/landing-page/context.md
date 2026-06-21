# Landing Page Context

**Gathered:** 2026-06-21
**Status:** Ready for design

---

## Feature Boundary

Landing page pública do Studio Blessed (rota `/`, SSR) apresentando o salão, serviços, profissionais, depoimentos e informações de contato. Link para o fluxo de autoatendimento (`/agendar`).

---

## Implementation Decisions

### Estrutura Visual

- Seguir a especificação anatômica detalhada fornecida pela proprietária (11 seções: Navbar, Hero, Pilares, Mosaico, Depoimentos, Profissionais, CTA Banner, Serviços, Why Choose Us, Localização/Galeria, Footer)
- Adaptar estrutura de template de salão premium para a marca Studio Blessed

### Idioma e Conteúdo

- **Idioma:** Português (adaptado do legado React + conteúdo original do Studio Blessed)
- **Hero headline:** Texto do legado — "Realce sua beleza, descubra sua melhor versão." + subtítulo "Venha sentir-se única, valorizada e bem cuidada"
- **CTA Hero:** Leva para `/agendar` (fluxo de autoatendimento)
- **Botão Hero:** Sempre visível (mesmo se offline)

### Paleta de Cores

- Seguir estritamente `.specs/lading-page/paleta-cores.css`
- Usar tokens semânticos: `bg-background`, `text-foreground`, `text-accent`, `bg-dark`, `text-dark`, etc.
- Configurar como tema Tailwind CSS personalizado

### Seções Específicas

- **Produtos (E-Commerce):** Substituída por seção de Depoimentos (carrossel de depoimentos de clientes)
- **Profissionais:** Dinâmico via API (`GET /api/booking/professionals`), não estático
- **Serviços:** Conteúdo dos serviços do Studio Blessed (do legado React: Extensão de Cílios, Lash Lifting, Sobrancelha, Hidra Gloss, Epilação, Limpeza de Pele, Unhas, Manicure/Pedicure)
- **Galeria:** Seção de galeria visual conforme legado
- **Localização:** Google Maps embed conforme legado (R. Imbauva, 20 - Pq. Viana, Barueri-SP)

### Footer

- Contato: Telefone (11) 98888-0015, Instagram @studioblessed
- Endereço: R. Imbauva, 20 - Pq. Viana, Sala 3, Barueri-SP
- Horários: Seg-Sex 08h-18h, Sáb 08h-15h, Dom Fechado
- Atendimento somente com agendamento prévio

### Técnico

- **Framework:** Nuxt 3 + Tailwind CSS (`@nuxtjs/tailwindcss`)
- **Rota:** `/` com `prerender: true` (SSR estático para SEO)
- **Transições:** `transition-all duration-300` em todos botões e links
- **Paddings consistentes:** `py-20 md:py-28` nas seções
- **Sem dependência de Vuetify** (Tailwind puro)

### Agent's Discretion

- Layout responsivo (breakpoints Tailwind padrão: sm/md/lg/xl)
- Escolha de imagens placeholder (usar placeholders de alta qualidade de banco de imagens)
- Ícones: usar Heroicons ou SVG inline minimalistas
- Efeitos de hover, animações suaves de scroll

---

## Specific References

- **Legado React:** `.specs/lading-page/legado.tsx` — textos de referência para conteúdo do Studio Blessed
- **Paleta de Cores:** `.specs/lading-page/paleta-cores.css` — tokens de cor obrigatórios
- **Imagem de referência:** `.specs/lading-page/landing-page.jpg` — estrutura anatômica (não pôde ser lida)

---

## Deferred Ideas

- E-commerce/vitrine de produtos — postergado (substituído por depoimentos no v1)
- Animações complexas de scroll (reveal, parallax) — simples fade-in por enquanto
- SEO avançado (JSON-LD, Open Graph, sitemap) — configurar no próximo milestone
