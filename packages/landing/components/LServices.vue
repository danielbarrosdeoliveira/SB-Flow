<template>
  <section id="services" class="py-20 md:py-28 bg-sb-white">
    <div class="max-w-[1400px] mx-auto px-8 lg:px-12">
      <div class="flex items-end justify-between mb-16 gap-6">
        <div>
          <span class="font-sans text-xs uppercase tracking-[0.2em] text-sb-primary font-semibold">04 / Serviços</span>
          <h2 class="font-serif text-4xl md:text-5xl text-sb-dark mt-3 leading-tight">
            Nossos Serviços
          </h2>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="servico in servicos"
          :key="servico.name"
          class="group"
        >
          <div class="aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-4">
            <img
              :src="servico.image"
              :alt="servico.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div class="text-left">
            <h3 class="font-sans font-light text-base text-sb-dark leading-tight">
              {{ servico.name }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const servicos = [
  { name: "Extensão de Cílios", image: "/images/extensao-cilios.png" },
  { name: "Lash Lifting", image: "/images/lash-lifting.png" },
  { name: "Sobrancelha", image: "/images/sobrancelha.png" },
  { name: "Hidra Gloss", image: "/images/hydra-gloss.jpg" },
  { name: "Epilação", image: "/images/epilacao-corporal.png" },
  { name: "Limpeza de Pele", image: "/images/limpeza-de-pele.jpg" },
];
</script>
