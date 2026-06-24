<script setup lang="ts">
import type { Professional } from "~/features/professionals/composables/use-professionals";

const props = defineProps<{
  professionals: Professional[];
  isLoading: boolean;
  error: Error | null;
  totalItems: number;
  pageSize: number;
  hasFilters: boolean;
}>();

const emit = defineEmits<{
  edit: [professional: Professional];
  toggleActive: [professional: Professional, event: Event];
  refetch: [];
  "update:currentPage": [page: number];
}>();

const currentPageModel = defineModel<number>("currentPage", { required: true });

const displayedCount = computed(() =>
  Math.min(currentPageModel.value * props.pageSize, props.totalItems),
);

function onToggleToggle(prof: Professional, event: Event) {
  emit("toggleActive", prof, event);
}
</script>

<template>
  <!-- Loading state -->
  <div v-if="isLoading" class="flex justify-center py-12">
    <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
  </div>

  <!-- Error state -->
  <UCard v-else-if="error" class="rounded-xl">
    <div class="text-center py-8">
      <UIcon name="i-lucide-alert-circle" class="w-10 h-10 mx-auto text-error" />
      <p class="mt-3 text-sm text-muted">Erro ao carregar profissionais</p>
      <UButton size="sm" color="neutral" variant="soft" class="mt-3" @click="emit('refetch')">
        Tentar novamente
      </UButton>
    </div>
  </UCard>

  <!-- Empty state -->
  <UCard v-else-if="professionals.length === 0 && !isLoading" class="rounded-xl">
    <div class="text-center py-12">
      <UIcon name="i-lucide-users" class="w-12 h-12 mx-auto text-muted" />
      <p class="mt-3 font-medium text-foreground">
        {{ hasFilters ? "Nenhum profissional encontrado" : "Nenhum profissional cadastrado" }}
      </p>
      <p class="text-sm text-muted mt-1">
        {{ hasFilters ? "Tente ajustar a busca ou os filtros" : 'Clique em "Novo Profissional" para começar' }}
      </p>
    </div>
  </UCard>

  <!-- Grid -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
    <ProfessionalCard
      v-for="prof in professionals"
      :key="prof.id"
      :professional="prof"
      @edit="emit('edit', $event)"
      @toggle-active="onToggleToggle"
    />
  </div>

  <!-- Footer -->
  <div v-if="totalItems > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-sm text-muted">
      Exibindo {{ displayedCount }} de {{ totalItems }}
      {{ totalItems === 1 ? "profissional" : "profissionais" }}
    </p>
    <UPagination
      v-if="Math.ceil(totalItems / pageSize) > 1"
      v-model="currentPageModel"
      :total="totalItems"
      :page-size="pageSize"
      :max="5"
      size="sm"
    />
  </div>
</template>
