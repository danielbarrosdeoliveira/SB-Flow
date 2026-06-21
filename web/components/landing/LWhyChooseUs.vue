<template>
  <section class="py-20 md:py-28 bg-sb-sand/10">
    <div class="max-w-[1400px] mx-auto px-8 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="space-y-8">
          <span class="font-sans text-xs uppercase tracking-[0.2em] text-sb-primary font-semibold">05 / Diferenciais</span>
          <h2 class="font-serif text-4xl md:text-5xl text-sb-dark leading-tight">
            Por que escolher<br>o Studio Blessed?
          </h2>
          <div class="grid grid-cols-2 gap-8">
            <div>
              <p class="font-serif text-5xl md:text-6xl text-sb-primary font-bold">500+</p>
              <p class="font-sans text-sb-warm text-sm mt-1">Clientes satisfeitas</p>
            </div>
            <div>
              <p class="font-serif text-5xl md:text-6xl text-sb-primary font-bold">5+</p>
              <p class="font-sans text-sb-warm text-sm mt-1">Anos de experiência</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div v-for="item in diferenciais" :key="item.title" class="bg-white rounded-xl p-5 shadow-sm border border-sb-sand/20 space-y-2">
            <div class="w-10 h-10 rounded-full bg-sb-primary/10 flex items-center justify-center">
              <span v-html="item.icon" class="w-5 h-5 text-sb-primary" />
            </div>
            <h4 class="font-sans text-sm font-bold text-sb-dark uppercase tracking-wider">{{ item.title }}</h4>
            <p class="font-sans text-xs text-sb-warm leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const diferenciais = [
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>',
    title: "Agendamento Online",
    description: "Agende seu horário pelo site, sem precisar ligar ou enviar WhatsApp.",
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>',
    title: "Localização Premium",
    description: "Espaço aconchegante no Parque Viana, Barueri, pensado para seu conforto.",
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    title: "Atendimento Premium",
    description: "Produtos de alta qualidade e técnicas especializadas para o melhor resultado.",
  },
  {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    title: "Resultados Garantidos",
    description: "Profissionais experientes que entregam resultados que superam expectativas.",
  },
];
</script>
