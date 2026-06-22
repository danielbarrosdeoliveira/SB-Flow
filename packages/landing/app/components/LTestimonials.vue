<template>
  <section id="testimonials" class="py-20 md:py-28 bg-sb-white">
    <div class="max-w-[1400px] mx-auto px-8 lg:px-12">
      <div class="text-center mb-16 space-y-2">
        <span class="font-sans text-xs uppercase tracking-[0.2em] text-sb-primary font-semibold">Depoimentos</span>
        <h2 class="font-serif text-4xl md:text-5xl text-sb-dark leading-tight">
          O que nossas clientes dizem
        </h2>
        <p class="font-sans text-sb-warm text-base italic max-w-xl mx-auto">
          A satisfação de quem vive a experiência Studio Blessed.
        </p>
      </div>

      <div class="relative max-w-5xl mx-auto">
        <div class="overflow-hidden">
          <div
            class="flex"
            :class="{ 'transition-transform duration-500 ease-in-out': transitionEnabled }"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <div
              v-for="(depo, i) in displayItems"
              :key="i"
              class="min-w-full md:min-w-[50%] px-3"
            >
              <div class="bg-white border border-sb-sand/30 rounded-xl p-8 h-full shadow-sm">
                <Icon icon="lucide:quote" class="w-8 h-8 text-sb-primary/20 mb-4" />
                <p class="font-sans text-sb-warm italic leading-relaxed mb-6">
                  "{{ depo.text }}"
                </p>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-sb-sand/30 flex items-center justify-center font-serif font-bold text-sb-primary">
                    {{ depo.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-sans font-semibold text-sb-dark text-sm">{{ depo.name }}</p>
                    <div class="flex gap-0.5">
                      <span v-for="s in depo.rating" :key="s" class="text-sb-primary text-xs">★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white border border-sb-sand/50 shadow-md flex items-center justify-center text-sb-dark hover:text-sb-primary transition-all duration-300"
          @click="prev"
        >
          <Icon icon="lucide:chevron-left" class="w-5 h-5" />
        </button>
        <button
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white border border-sb-sand/50 shadow-md flex items-center justify-center text-sb-dark hover:text-sb-primary transition-all duration-300"
          @click="next"
        >
          <Icon icon="lucide:chevron-right" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const currentIndex = ref(0);
const transitionEnabled = ref(true);

const depoimentos = [
  {
    name: "Ana Silva",
    rating: 5,
    text: "Simplesmente amei o resultado da extensão de cílios! A Caroline é super cuidadosa e o ambiente é acolhedor. Saí me sentindo renovada.",
  },
  {
    name: "Marina Costa",
    rating: 5,
    text: "Faço limpeza de pele regularmente aqui e é o único lugar que realmente resolveu minha acne. Profissionais super dedicadas!",
  },
  {
    name: "Juliana Oliveira",
    rating: 5,
    text: "O Lash Lifting ficou incrível! E dura muito tempo. Super recomendo o Studio Blessed para quem quer praticidade no dia a dia.",
  },
  {
    name: "Patrícia Santos",
    rating: 4,
    text: "Vim por indicação e não me arrependo. A equipe é muito profissional e o espaço é lindo. Virei cliente fiel!",
  },
];

const displayItems = [...depoimentos, ...depoimentos, ...depoimentos];

function next() {
  if (currentIndex.value < depoimentos.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = depoimentos.length;
    setTimeout(() => snapTo(0), 500);
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    snapTo(depoimentos.length - 1);
  }
}

function snapTo(index: number) {
  transitionEnabled.value = false;
  currentIndex.value = index;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      transitionEnabled.value = true;
    });
  });
}
</script>
