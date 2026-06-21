# Landing Page — Specification

## Problem Statement

O Studio Blessed não possui uma presença web profissional. A página inicial atual (`/`) é um placeholder genérico "SB-Flow" que não representa a marca. Clientes em potencial não encontram informações sobre serviços, profissionais ou como agendar. A landing page resolverá isso com uma página SSR indexável por SEO.

## Goals

- [ ] Apresentar o Studio Blessed com identidade visual profissional (paleta de cores, tipografia, fotografia)
- [ ] Exibir serviços, profissionais, depoimentos e informações de contato
- [ ] Direcionar visitantes para o fluxo de agendamento (`/agendar`)
- [ ] SSR para indexação SEO

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| E-commerce / venda de produtos | Postergado para v2. Substituído por depoimentos. |
| Blog / CMS de notícias | Conteúdo estático no v1 |
| Animações complexas (parallax, scroll reveal) | Postergado para v2 |
| Multilíngue | Apenas português no v1 |
| Integração com redes sociais em tempo real | Links estáticos no v1 |

---

## User Stories

### P1: Navbar com navegação e CTA ⭐ MVP

**User Story**: Como visitante, quero uma navegação fixa no topo com links para as seções e um botão de agendamento para navegar facilmente.

**Acceptance Criteria**:
1. WHEN visitante rola a página THEN navbar SHALL permanecer fixa no topo com fundo semi-translúcido (`bg-background/90 backdrop-blur-md`)
2. WHEN visitante clica em link do menu THEN página SHALL rolar suavemente até a seção correspondente
3. WHEN visitante clica "Agendar Agora" THEN sistema SHALL redirecionar para `/agendar`
4. WHEN viewport é mobile THEN navbar SHALL exibir menu hamburguer com drawer lateral

**Independent Test**: Abrir página, clicar em cada link, verificar scroll suave para seção correta.

---

### P1: Hero Section com identidade visual ⭐ MVP

**User Story**: Como visitante, quero ver uma hero section impactante que comunique a essência do Studio Blessed.

**Acceptance Criteria**:
1. WHEN página carrega THEN hero SHALL ocupar `min-h-[80vh]` com imagem de fundo imersiva e overlay escuro
2. WHEN visitante vê o hero THEN headline "Realce sua beleza, descubra sua melhor versão." SHALL estar em fonte Serif, caixa alta, alinhada à esquerda
3. WHEN visitante vê o hero THEN subtítulo "Venha sentir-se única, valorizada e bem cuidada" SHALL aparecer abaixo
4. WHEN visitante vê o hero THEN dois botões CTA SHALL aparecer: "Agendar Agora" (sólido escuro) e "Saiba Mais" (outline claro)
5. WHEN visitante vê o hero THEN widget flutuante com avatares sobrepostos SHALL aparecer no canto inferior direito

**Independent Test**: Carregar página, verificar todos os elementos do hero visíveis e posicionados corretamente.

---

### P1: Seção de Serviços com cards ⭐ MVP

**User Story**: Como visitante, quero ver os serviços oferecidos com descrição para entender o que o salão oferece.

**Acceptance Criteria**:
1. WHEN visitante rola para seção de serviços THEN grid de 3 cards com imagem, título e descrição SHALL ser exibido
2. WHEN visitante clica "Agendar" em um serviço THEN sistema SHALL redirecionar para `/agendar`
3. WHEN tela é mobile THEN grid SHALL ser 1 coluna
4. WHEN tela é desktop THEN grid SHALL ser 3 colunas

**Independent Test**: Verificar 3 cards de serviço visíveis com imagem e descrição.

---

### P1: Seção de Profissionais dinâmica via API ⭐ MVP

**User Story**: Como visitante, quero conhecer as profissionais do salão com foto e especialidade.

**Acceptance Criteria**:
1. WHEN página carrega THEN profissionais SHALL ser buscadas via `GET /api/booking/professionals`
2. WHEN API retorna profissionais THEN grid de cards com foto, nome e especialidade SHALL ser exibido
3. WHEN API está indisponível THEN seção SHALL mostrar mensagem "Conheça nossas profissionais em breve" sem quebrar a página
4. WHEN visitante clica "Agendar" em uma profissional THEN sistema SHALL redirecionar para `/agendar`

**Independent Test**: Desativar API, verificar fallback sem quebra. Ativar API, verificar cards populados.

---

### P1: Footer com informações de contato ⭐ MVP

**User Story**: Como visitante, quero encontrar telefone, endereço, horários e redes sociais no rodapé.

**Acceptance Criteria**:
1. WHEN visitante rola ao final da página THEN footer escuro com logo, links e contato SHALL ser exibido
2. WHEN visitante clica no telefone THEN link SHALL abrir discagem (`tel:`)
3. WHEN visitante clica no Instagram THEN link SHALL abrir perfil em nova aba
4. WHEN visitante vê o footer THEN horários de funcionamento SHALL estar visíveis

**Independent Test**: Verificar footer com todas as informações de contato.

---

### P2: Mosaico Institucional (Quem Somos)

**User Story**: Como visitante, quero conhecer a história do Studio Blessed para criar conexão emocional.

**Acceptance Criteria**:
1. WHEN visitante rola para seção "Quem Somos" THEN layout de duas metades com fotos (esquerda) e texto (direita) SHALL ser exibido
2. WHEN visitante lê o texto THEN história da Caroline e do Studio Blessed SHALL estar em formato editorial
3. WHEN visitante clica "Ver Detalhes" THEN sistema SHALL redirecionar para `/agendar`

**Independent Test**: Verificar layout de duas colunas com fotos e texto narrativo.

---

### P2: Depoimentos (Carrossel)

**User Story**: Como visitante, quero ler depoimentos de clientes para construir confiança.

**Acceptance Criteria**:
1. WHEN visitante rola para seção de depoimentos THEN carrossel com cards de depoimentos SHALL ser exibido
2. WHEN visitante clica nas setas de navegação THEN carrossel SHALL avançar/voltar
3. WHEN visitante está no mobile THEN gestos de swipe SHALL funcionar (se suportado pelo navegador)

**Independent Test**: Navegar pelo carrossel de depoimentos, verificar cards alternando.

---

### P2: Localização com Google Maps

**User Story**: Como visitante, quero ver onde o salão fica localizado para planejar minha visita.

**Acceptance Criteria**:
1. WHEN visitante rola para seção de localização THEN mapa incorporado SHALL ser exibido
2. WHEN visitante interage com o mapa THEN Google Maps SHALL carregar interativamente

**Independent Test**: Verificar mapa carregando e mostrando endereço correto.

---

### P3: Pilares de Assinatura

**User Story**: Como visitante, quero entender os diferenciais do salão através de pilares visuais.

**Acceptance Criteria**:
1. WHEN visitante rola para seção de pilares THEN grid de 3 colunas com ícone, título e descrição SHALL ser exibido
2. WHEN visitante clica no link de cada pilar THEN ação apropriada SHALL ocorrer (agendamento ou informação)

**Independent Test**: Verificar 3 pilares visíveis.

---

### P3: CTA Banner

**User Story**: Como visitante, quero um CTA destacado no meio da página para agendar rapidamente.

**Acceptance Criteria**:
1. WHEN visitante rola para o CTA banner THEN faixa escura com "Agende Seu Horário" e botão "Agendar Agora" SHALL ser exibida
2. WHEN visitante clica no botão THEN sistema SHALL redirecionar para `/agendar`

**Independent Test**: Clicar no botão do CTA banner, verificar redirecionamento.

---

### P3: Why Choose Us (Métricas)

**User Story**: Como visitante, quero ver métricas e diferenciais que comprovam a qualidade do salão.

**Acceptance Criteria**:
1. WHEN visitante rola para seção THEN layout de duas metades com contadores (esquerda) e grid de diferenciais (direita) SHALL ser exibido

**Independent Test**: Verificar seção com números e diferenciais.

---

## Edge Cases

- WHEN API de profissionais falha THEN seção de profissionais SHALL exibir fallback sem quebrar layout
- WHEN imagem de fundo do hero não carrega THEN fallback de cor sólida escura SHALL aparecer
- WHEN Google Maps não carrega (bloqueio de script) THEN fallback de endereço textual SHALL ser exibido
- WHEN página é acessada em dispositivo muito lento THEN todas as imagens SHALL ter lazy loading
- WHEN viewport é muito estreita (< 360px) THEN layout SHALL não quebrar (overflow-x hidden)
- WHEN JavaScript está desabilitado THEN navegação por âncoras SHALL funcionar via HTML puro

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| LP-NAV-01 | P1: Navbar | Spec | Pending |
| LP-NAV-02 | P1: Navbar | Spec | Pending |
| LP-NAV-03 | P1: Navbar | Spec | Pending |
| LP-HERO-01 | P1: Hero | Spec | Pending |
| LP-HERO-02 | P1: Hero | Spec | Pending |
| LP-HERO-03 | P1: Hero | Spec | Pending |
| LP-SERV-01 | P1: Serviços | Spec | Pending |
| LP-SERV-02 | P1: Serviços | Spec | Pending |
| LP-PROF-01 | P1: Profissionais | Spec | Pending |
| LP-PROF-02 | P1: Profissionais | Spec | Pending |
| LP-PROF-03 | P1: Profissionais | Spec | Pending |
| LP-FOOT-01 | P1: Footer | Spec | Pending |
| LP-FOOT-02 | P1: Footer | Spec | Pending |
| LP-FOOT-03 | P1: Footer | Spec | Pending |
| LP-QUEM-01 | P2: Quem Somos | Spec | Pending |
| LP-DEPO-01 | P2: Depoimentos | Spec | Pending |
| LP-LOC-01 | P2: Localização | Spec | Pending |
| LP-PIL-01 | P3: Pilares | Spec | Pending |
| LP-CTA-01 | P3: CTA Banner | Spec | Pending |
| LP-WHY-01 | P3: Why Choose Us | Spec | Pending |
| LP-EDGE-01 | Edge Cases | - | Pending |

**Coverage:** 21 total, 0 mapped to tasks, 21 unmapped

---

## Success Criteria

- [ ] Landing page carrega em < 3s em conexão 4G
- [ ] Visitante consegue encontrar serviços e agendar em < 2 cliques
- [ ] 100% das seções renderizam sem erro no SSR
- [ ] Navegação por âncoras funciona com e sem JS
- [ ] Nota Lighthouse > 80 em Performance, > 90 em Accessibility e SEO
