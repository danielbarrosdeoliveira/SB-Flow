<template>
  <section class="py-20 md:py-28 bg-sb-white">
    <div class="max-w-[1400px] mx-auto px-8 lg:px-12">
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-16 gap-8">
        <div class="max-w-lg">
          <span class="font-sans text-xs uppercase tracking-[0.2em] text-sb-primary font-semibold">01 / Pilares</span>
          <h2 class="font-serif text-4xl md:text-5xl text-sb-dark mt-3 leading-tight">
            Nossa Essência
          </h2>
        </div>
        <p class="font-sans text-sb-warm text-base leading-relaxed max-w-xl lg:text-right">
          No Studio Blessed, cada detalhe é pensado para oferecer uma experiência única de beleza e bem-estar.
          Nossos pilares refletem o compromisso com a excelência.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="pilar in pilares" :key="pilar.title" class="text-center space-y-5 group">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-sb-primary/10 flex items-center justify-center group-hover:bg-sb-primary/20 transition-all duration-300">
            <span v-html="pilar.icon" class="w-7 h-7 text-sb-primary" />
          </div>
          <h3 class="font-sans text-sm uppercase tracking-[0.15em] text-sb-dark font-semibold">
            {{ pilar.title }}
          </h3>
          <p class="font-sans text-sb-warm text-sm leading-relaxed max-w-xs mx-auto">
            {{ pilar.description }}
          </p>
          <NuxtLink
            :to="pilar.link"
            class="inline-block font-sans text-xs uppercase tracking-wider text-sb-primary border border-sb-primary/30 rounded-full px-6 py-2 hover:bg-sb-primary hover:text-white transition-all duration-300"
          >
            {{ pilar.cta }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const pilares = [
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M5.64 18.36l12.72-12.72"/></svg>',
    title: "Nosso Salão",
    description:
      "Um ambiente acolhedor e premium onde cada detalhe é pensado para o seu bem-estar e satisfação.",
    link: "/agendar",
    cta: "Conhecer",
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    title: "Amamos Atender",
    description:
      "Atendimento personalizado e acolhedor, porque cada cliente é única e merece toda nossa dedicação.",
    link: "/agendar",
    cta: "Agendar",
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
    title: "Vale Presente",
    description:
      "Presenteie quem você ama com uma experiência de beleza e cuidado no Studio Blessed.",
    link: "/agendar",
    cta: "Presentear",
  },
];
</script>
