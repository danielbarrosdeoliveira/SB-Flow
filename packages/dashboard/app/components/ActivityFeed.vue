<script setup lang="ts">
defineProps<{
  activities: Array<{ text: string; time: string }>;
}>();
</script>

<template>
  <UCard class="rounded-xl borde">
    <h3 class="text-sm font-semibold mb-3">Atividades Recentes</h3>
    <div class="space-y-3">
      <div v-for="(activity, i) in activities" :key="i" class="flex gap-3">
        <div class="w-2 h-2 mt-1.5 rounded-full shrink-0 bg-primary" />
        <div class="min-w-0">
          <p class="text-sm truncate">{{ activity.text }}</p>
          <p class="text-xs dark:text-amber-100/50 text-primary-500/50">{{ activity.time }}</p>
        </div>
      </div>
    </div>
  </UCard>
</template>
