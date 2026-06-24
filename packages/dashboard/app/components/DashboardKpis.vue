<script setup lang="ts">
defineProps<{
  kpis: Array<{ label: string; value: string; icon: string }>;
}>();
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
    <UCard v-for="kpi in kpis" :key="kpi.label" class="rounded-xl">
      <div class="flex items-center gap-2">
        <UIcon :name="kpi.icon" class="w-5 h-5 shrink-0 dark:text-amber-100/50 text-primary-500/50" />
        <span>{{ kpi.label }}</span>
      </div>
      <p class="mt-2 text-xl lg:text-2xl font-bold text-primary">{{ kpi.value }}</p>
    </UCard>
  </div>
</template>
