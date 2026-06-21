<template>
  <section id="artists" class="py-20 md:py-28 bg-sb-sand/10">
    <div class="max-w-[1400px] mx-auto px-8 lg:px-12">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
        <div>
          <span class="font-sans text-xs uppercase tracking-[0.2em] text-sb-primary font-semibold">03 / Profissionais</span>
          <h2 class="font-serif text-4xl md:text-5xl text-sb-dark mt-3 leading-tight">
            Nossa Equipe
          </h2>
          <p class="font-sans text-sb-warm text-base mt-4 max-w-lg">
            Conheça as profissionais que fazem do Studio Blessed um espaço único de beleza e cuidado.
          </p>
        </div>
      </div>

      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="bg-sb-sand/30 rounded-lg h-[350px] mb-4" />
          <div class="h-4 bg-sb-sand/30 rounded w-2/3 mb-2" />
          <div class="h-3 bg-sb-sand/20 rounded w-1/3" />
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="font-sans text-sb-warm">Conheça nossas profissionais em breve</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="prof in professionals"
          :key="prof.id"
          class="group"
        >
          <div class="relative overflow-hidden rounded-lg bg-sb-sand/20 mb-4">
            <div class="aspect-[3/4] flex items-center justify-center">
              <div class="w-full h-full bg-gradient-to-br from-sb-primary/20 to-sb-sand/30 flex items-center justify-center">
                <span class="font-serif text-6xl text-sb-primary/40">{{ prof.name?.charAt(0) || '?' }}</span>
              </div>
            </div>
          </div>
          <h3 class="font-sans text-sm uppercase tracking-[0.15em] text-sb-dark font-bold">
            {{ prof.name }}
          </h3>
          <p class="font-sans text-xs text-sb-warm mt-1">Profissional</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
interface Professional {
  id: number;
  name: string;
}

const config = useRuntimeConfig();

const {
  data: professionals,
  pending,
  error,
} = useFetch<Professional[]>(`${config.public.apiUrl}/api/booking/professionals`, {
  server: false,
  lazy: true,
  credentials: "include",
});
</script>
