<script setup lang="ts">
import type { Service } from "~/features/services/composables/use-services";

defineProps<{
  service: Service;
}>();

const emit = defineEmits<{
  edit: [service: Service];
}>();

function formatPrice(value: string | null): string {
  if (!value) return "";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
</script>

<template>
  <UCard
    class="rounded-xl cursor-pointer hover:shadow-md transition-shadow overflow-hidden p-0"
    @click="emit('edit', service)"
  >
    <div class="flex flex-row sm:flex-col">
      <div
        class="w-[110px] sm:w-full sm:h-[160px] shrink-0 bg-gradient-to-br from-primary-200 to-primary-400 dark:from-primary-800 dark:to-primary-600 flex items-center justify-center"
      >
        <UIcon name="i-lucide-sparkles" class="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 dark:text-primary-200" />
      </div>

      <div class="flex-1 flex flex-col min-w-0 p-3 sm:p-4">
        <UBadge
          v-if="service.category"
          color="neutral"
          variant="soft"
          size="xs"
          class="w-fit mb-1.5"
        >
          {{ service.category }}
        </UBadge>

        <h3 class="font-bold text-foreground line-clamp-1 text-sm sm:text-base">
          {{ service.name }}
        </h3>

        <p v-if="service.procedureType" class="text-xs text-muted mt-0.5">
          {{ service.procedureType }}
        </p>

        <p v-if="service.description" class="text-xs sm:text-sm text-muted line-clamp-2 mt-0.5 sm:mt-1">
          {{ service.description }}
        </p>

        <div class="flex-1 min-h-2" />

        <div class="flex items-center justify-between pt-2 sm:pt-3 border-t border-border mt-1 sm:mt-2">
          <!-- Parent: show variations badge -->
          <template v-if="!service.price && !service.durationMinutes">
            <span class="text-xs text-primary font-medium flex items-center gap-1">
              <UIcon name="i-lucide-layers" class="w-3.5 h-3.5" />
              Com variações
            </span>
          </template>
          <!-- Child: show price + duration -->
          <template v-else>
            <span class="font-bold text-foreground text-sm sm:text-base">
              {{ formatPrice(service.price) }}
            </span>
            <span class="flex items-center gap-1 text-xs sm:text-sm text-muted">
              <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
              {{ service.durationMinutes }} min
            </span>
          </template>
        </div>
      </div>
    </div>
  </UCard>
</template>
