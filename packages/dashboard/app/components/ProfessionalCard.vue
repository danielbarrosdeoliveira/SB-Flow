<script setup lang="ts">
import type { Professional } from "~/features/professionals/composables/use-professionals";
import { maskPhone } from "~/utils/phone";

const props = defineProps<{
  professional: Professional;
}>();

const emit = defineEmits<{
  edit: [professional: Professional];
  toggleActive: [professional: Professional, event: Event];
}>();

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return (parts[0] ?? "").slice(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

const avatarColors = [
  "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300",
  "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300",
  "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
  "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300",
  "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300",
  "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300",
  "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length] ?? "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300";
}

const roleLabels: Record<string, string> = {
  OWNER: "Proprietária",
  PARTNER: "Parceira",
};
</script>

<template>
  <UCard class="rounded-xl cursor-pointer hover:shadow-md transition-shadow" @click="emit('edit', professional)">
    <div class="flex flex-col items-center text-center gap-2 py-2">
      <div class="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
        :class="getAvatarColor(professional.name)">
        {{ getInitials(professional.name) }}
      </div>

      <h3 class="font-semibold text-foreground mt-1">{{ professional.name }}</h3>

      <p class="text-xs text-muted">
        #{{ professional.id }} &middot; {{ roleLabels[professional.role] ?? professional.role }}
      </p>

      <p class="text-sm flex items-center gap-1.5 text-muted">
        <UIcon name="i-lucide-phone" class="w-3.5 h-3.5 shrink-0" />
        {{ maskPhone(professional.phone) }}
      </p>

      <UBadge :color="professional.isActive ? 'success' : 'neutral'" variant="soft" size="sm">
        {{ professional.isActive ? "Ativo" : "Inativo" }}
      </UBadge>
    </div>

    <template #footer>
      <div class="flex justify-center pt-2">
        <UButton :icon="professional.isActive ? 'i-lucide-toggle-right' : 'i-lucide-toggle-left'"
          :label="professional.isActive ? 'Desativar' : 'Ativar'" color="neutral" variant="ghost" size="xs"
          @click="emit('toggleActive', professional, $event)" />
      </div>
    </template>
  </UCard>
</template>
