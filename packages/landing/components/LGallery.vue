<template>
  <section id="gallery" class="py-20 md:py-28 bg-sb-white">
    <div class="max-w-[1400px] mx-auto px-8 lg:px-12">
      <div class="text-center mb-16 space-y-2">
        <span class="font-sans text-xs uppercase tracking-[0.2em] text-sb-primary font-semibold">Galeria</span>
        <h2 class="font-serif text-4xl md:text-5xl text-sb-dark leading-tight">
          Nossos Trabalhos
        </h2>
        <p class="font-sans text-sb-warm text-base italic max-w-xl mx-auto">
          Resultados que falam por si.
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(img, i) in imagens"
          :key="i"
          class="group overflow-hidden rounded-lg"
          :class="i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/5]'"
        >
          <img
            :src="img"
            :alt="`Galeria Studio Blessed ${i + 1}`"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const imagens = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&q=80",
  "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80",
  "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80",
];
</script>
