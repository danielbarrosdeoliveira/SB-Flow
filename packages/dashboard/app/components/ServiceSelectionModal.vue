<script setup lang="ts">
import type { CatalogItem, ParentService } from "~/features/appointments/composables/use-service-catalog";

const props = defineProps<{
  parent: ParentService;
}>();

const emit = defineEmits<{
  confirm: [child: CatalogItem];
}>();

const selectedChild = ref<CatalogItem | null>(null);

function selectChild(child: CatalogItem) {
  selectedChild.value = child;
}

function formatPrice(value: string | null): string {
  if (!value) return "";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const totalPrice = computed(() => {
  if (!selectedChild.value?.price) return "";
  return formatPrice(selectedChild.value.price);
});
</script>

<template>
  <UModal
    :title="parent.name"
    :description="parent.description ?? ''"
    size="lg"
  >
    <template #body>
      <!-- Parent info header -->
      <div class="flex items-start gap-4 mb-6">
        <div class="w-16 h-16 rounded-xl shrink-0 bg-gradient-to-br from-primary-200 to-primary-400 dark:from-primary-800 dark:to-primary-600 flex items-center justify-center">
          <UIcon name="i-lucide-sparkles" class="w-7 h-7 text-primary-600 dark:text-primary-200" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-foreground text-lg">{{ parent.name }}</h3>
          <p class="text-sm text-muted mt-1 leading-relaxed">{{ parent.description }}</p>
        </div>
      </div>

      <!-- Separator -->
      <div class="border-t border-border my-4" />

      <!-- Selection section -->
      <div>
        <h4 class="font-semibold text-foreground mb-3 flex items-center gap-2">
          <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-primary" />
          Escolha o tipo de procedimento:
        </h4>

        <!-- Options list -->
        <div class="space-y-2">
          <label
            v-for="child in parent.children"
            :key="child.id"
            class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150"
            :class="selectedChild?.id === child.id
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-border hover:border-primary/50 hover:bg-warm-50 dark:hover:bg-warm-900/20'"
            @click="selectChild(child)"
          >
            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
              :class="selectedChild?.id === child.id
                ? 'border-primary bg-primary'
                : 'border-muted'"
            >
              <div v-if="selectedChild?.id === child.id" class="w-2 h-2 rounded-full bg-white" />
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground">{{ child.name }}</p>
              <p v-if="child.description" class="text-xs text-muted mt-0.5 line-clamp-1">
                {{ child.description }}
              </p>
            </div>

            <div class="text-right shrink-0">
              <p class="text-sm font-bold text-foreground">
                {{ formatPrice(child.price) }}
              </p>
              <p class="text-xs text-muted flex items-center gap-1 justify-end">
                <UIcon name="i-lucide-clock" class="w-3 h-3" />
                {{ child.durationMinutes }} min
              </p>
            </div>
          </label>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex items-center justify-between w-full gap-3">
        <div>
          <p v-if="selectedChild" class="text-sm text-muted">
            Procedimento: <span class="font-medium text-foreground">{{ selectedChild.name }}</span>
          </p>
          <p v-else class="text-sm text-muted">Selecione uma opção acima</p>
        </div>

        <div class="flex items-center gap-2">
          <UButton label="Cancelar" color="neutral" variant="outline" size="md" @click="close" />
          <UButton
            :disabled="!selectedChild"
            size="md"
            @click="selectedChild && emit('confirm', selectedChild)"
          >
            <template #leading>
              <UIcon name="i-lucide-calendar-check" class="w-4 h-4" />
            </template>
            {{ selectedChild ? `Agendar - ${totalPrice}` : "Confirmar Agendamento" }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
