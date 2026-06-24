<script setup lang="ts">
import type { Client } from "~/features/clients/composables/use-clients";
import { maskPhone } from "~/utils/phone";

defineProps<{
  client: Client;
}>();

const emit = defineEmits<{
  edit: [client: Client];
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
</script>

<template>
  <UCard
    class="rounded-xl cursor-pointer hover:shadow-md transition-shadow"
    @click="emit('edit', client)"
  >
    <div class="flex flex-col items-center text-center gap-2 py-2">
      <div
        class="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
        :class="getAvatarColor(client.name)"
      >
        {{ getInitials(client.name) }}
      </div>

      <h3 class="font-semibold text-foreground mt-1">{{ client.name }}</h3>

      <p class="text-xs text-muted">#{{ client.id }}</p>

      <p class="text-sm flex items-center gap-1.5 text-muted">
        <UIcon name="i-lucide-phone" class="w-3.5 h-3.5 shrink-0" />
        {{ maskPhone(client.phone) }}
      </p>
    </div>
  </UCard>
</template>
