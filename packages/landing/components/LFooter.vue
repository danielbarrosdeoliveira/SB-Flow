<template>
  <footer id="location" class="bg-sb-dark text-white px-8 lg:px-12 pt-16 pb-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
      <div class="sm:col-span-2 lg:col-span-1">
        <a href="#" class="inline-block hover:opacity-80 transition-opacity duration-300">
          <img src="/images/logo-studio-blessed-white.svg" alt="Studio Blessed" class="h-20 sm:h-28 md:h-36 lg:h-40 xl:h-44 2xl:h-48 w-auto" />
        </a>
      </div>

      <div class="space-y-4">
        <h4 class="font-sans text-xs uppercase tracking-[0.15em] text-sb-primary font-semibold">Studio</h4>
        <ul class="space-y-2">
          <li v-for="link in studioLinks" :key="link.label">
            <a :href="link.href" class="font-sans text-sm text-white/60 hover:text-sb-primary-light transition-colors duration-300">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>

      <div class="space-y-4">
        <h4 class="font-sans text-xs uppercase tracking-[0.15em] text-sb-primary font-semibold">Serviços</h4>
        <ul class="space-y-2">
          <li v-for="servico in servicos" :key="servico">
            <span class="font-sans text-sm text-white/60">{{ servico }}</span>
          </li>
        </ul>
      </div>

      <div class="space-y-4">
        <h4 class="font-sans text-xs uppercase tracking-[0.15em] text-sb-primary font-semibold">Horários</h4>
        <div class="space-y-3 font-sans text-sm">
          <div class="flex justify-between border-b border-white/10 pb-1">
            <span class="text-white/60">Seg a Sex</span>
            <span class="text-sb-primary-light font-medium">08h às 18h</span>
          </div>
          <div class="flex justify-between border-b border-white/10 pb-1">
            <span class="text-white/60">Sábado</span>
            <span class="text-sb-primary-light font-medium">08h às 15h</span>
          </div>
          <div class="flex justify-between">
            <span class="text-white/40 italic">Domingo</span>
            <span class="text-white/40 font-bold uppercase tracking-tighter">Fechado</span>
          </div>
          <p class="text-[10px] text-white/50 pt-2 uppercase tracking-[0.2em] italic">
            * Atendemos somente com agendamento prévio.
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="font-sans text-xs uppercase tracking-[0.15em] text-sb-primary font-semibold">Contato</h4>
        <div class="space-y-3 font-sans text-sm text-white/80">
          <p class="flex items-center gap-3">
            <Icon name="lucide:phone" class="w-4 h-4 text-sb-primary shrink-0" />
            <a href="tel:+5511988880015" class="hover:text-sb-primary-light transition-colors duration-300">(11) 98888-0015</a>
          </p>
          <p class="flex items-center gap-3">
            <Icon name="lucide:instagram" class="w-4 h-4 text-sb-primary shrink-0" />
            <a href="https://instagram.com/studioblessed" target="_blank" rel="noopener noreferrer" class="hover:text-sb-primary-light transition-colors duration-300">@studioblessed</a>
          </p>
          <p class="flex items-start gap-3 italic">
            <Icon name="lucide:map-pin" class="w-4 h-4 text-sb-primary shrink-0 mt-1" />
            <span>
              R. Imbauva, 20 - Pq. Viana, Sala 3<br>
              Barueri-SP
            </span>
          </p>
        </div>
        <div class="flex gap-4 pt-2">
          <a href="https://instagram.com/studioblessed" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-sb-primary-light hover:border-sb-primary-light transition-all duration-300">
            <Icon name="lucide:instagram" class="w-4 h-4" />
          </a>
          <a href="https://wa.me/5511988880015" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-sb-primary-light hover:border-sb-primary-light transition-all duration-300">
            <Icon name="mdi:whatsapp" class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10 pt-8 text-center">
      <p class="font-sans text-[10px] tracking-[0.3em] text-white/30 uppercase">
        &copy; 2026 Studio Blessed. Todos os direitos reservados.
      </p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const studioLinks = [
  { href: "#hero", label: "Início" },
  { href: "#about", label: "Sobre" },
  { href: "#services", label: "Serviços" },
  { href: "#artists", label: "Profissionais" },
  { href: "#testimonials", label: "Depoimentos" },
];

const servicos = [
  "Extensão de Cílios",
  "Lash Lifting",
  "Sobrancelha",
  "Hidra Gloss",
  "Epilação",
  "Limpeza de Pele",
];
</script>
