<template>
  <footer id="location" class="bg-sb-dark text-white">
    <div class="max-w-[1400px] mx-auto px-8 lg:px-12 pt-16 pb-8">
      <div class="text-center mb-16">
        <a href="#" class="font-cursive text-4xl text-sb-primary hover:text-sb-primary-light transition-colors duration-300">
          Studio Blessed
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
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
              <svg class="w-4 h-4 text-sb-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <a href="tel:+5511988880015" class="hover:text-sb-primary-light transition-colors duration-300">(11) 98888-0015</a>
            </p>
            <p class="flex items-center gap-3">
              <svg class="w-4 h-4 text-sb-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <a href="https://instagram.com/studioblessed" target="_blank" rel="noopener noreferrer" class="hover:text-sb-primary-light transition-colors duration-300">@studioblessed</a>
            </p>
            <p class="flex items-start gap-3 italic">
              <svg class="w-4 h-4 text-sb-primary shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span>
                R. Imbauva, 20 - Pq. Viana, Sala 3<br>
                Barueri-SP
              </span>
            </p>
          </div>
          <div class="flex gap-4 pt-2">
            <a href="https://instagram.com/studioblessed" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-sb-primary-light hover:border-sb-primary-light transition-all duration-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://wa.me/5511988880015" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-sb-primary-light hover:border-sb-primary-light transition-all duration-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-white/10 pt-8 text-center">
        <p class="font-sans text-[10px] tracking-[0.3em] text-white/30 uppercase">
          &copy; 2026 Studio Blessed. Todos os direitos reservados.
        </p>
      </div>
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
