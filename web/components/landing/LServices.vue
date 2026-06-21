<template>
  <section id="services" class="py-20 md:py-28 bg-sb-white">
    <div class="max-w-[1400px] mx-auto px-8 lg:px-12">
      <div class="text-center mb-16 space-y-2">
        <span class="font-sans text-xs uppercase tracking-[0.2em] text-sb-primary font-semibold">04 / Serviços</span>
        <h2 class="font-serif text-4xl md:text-5xl text-sb-dark leading-tight">
          Nossos Serviços
        </h2>
        <p class="font-sans text-sb-warm text-base italic max-w-xl mx-auto">
          Cuidados especializados para realçar sua beleza com qualidade e carinho.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="servico in servicos"
          :key="servico.name"
          class="group bg-white border border-sb-sand/30 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div class="h-48 overflow-hidden">
            <img
              :src="servico.image"
              :alt="servico.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div class="p-6 space-y-4">
            <h3 class="font-serif text-2xl text-sb-dark font-bold leading-tight">
              {{ servico.name }}
            </h3>
            <p class="font-sans text-sb-warm text-sm leading-relaxed">
              {{ servico.description }}
            </p>
            <NuxtLink
              to="/agendar"
              class="inline-block font-sans text-xs uppercase tracking-wider text-sb-primary border border-sb-primary/30 rounded-full px-6 py-2 hover:bg-sb-primary hover:text-white transition-all duration-300"
            >
              Agendar
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const servicos = [
  {
    name: "Extensão de Cílios",
    description:
      "Técnica fio a fio com materiais premium para garantir volume, curvatura e um olhar marcante, mantendo a saúde dos seus fios naturais.",
    image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&q=80",
  },
  {
    name: "Lash Lifting",
    description:
      "Tratamento que eleva e curva seus cílios naturais desde a raiz, proporcionando um efeito de rímel duradouro sem necessidade de extensões.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80",
  },
  {
    name: "Sobrancelha",
    description:
      "Design estratégico baseado no visagismo facial para valorizar seu olhar, incluindo mapeamento e remoção precisa de fios.",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
  },
  {
    name: "Hidra Gloss",
    description:
      "Hidratação profunda para lábios, devolvendo viço e brilho natural com efeito revitalizante e preenchimento de linhas finas.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
  },
  {
    name: "Epilação",
    description:
      "Remoção técnica de pelos com ceras de alta qualidade, deixando a pele lisa, macia e livre de irritações por muito mais tempo.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  },
  {
    name: "Limpeza de Pele",
    description:
      "Protocolo completo de higienização, extração de impurezas e hidratação profunda para revitalizar o brilho natural da sua face.",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80",
  },
];
</script>
