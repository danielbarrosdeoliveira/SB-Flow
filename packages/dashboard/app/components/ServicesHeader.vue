<script setup lang="ts">
const search = defineModel<string>("search", { required: true });
const categoryFilter = defineModel<string>("categoryFilter", { required: true });
const procedureTypeFilter = defineModel<string>("procedureTypeFilter", { required: true });

const emit = defineEmits<{
  create: [];
}>();

const categories = [
  { label: "Todos", value: "all" },
  { label: "Cabelo", value: "Cabelo" },
  { label: "Unhas", value: "Unhas" },
  { label: "Estética", value: "Estética" },
];

const procedureTypeByCategory: Record<string, { label: string; value: string }[]> = {
  Cabelo: [
    { label: "Corte", value: "Corte" },
    { label: "Escova", value: "Escova" },
    { label: "Coloração", value: "Coloração" },
    { label: "Hidratação", value: "Hidratação" },
    { label: "Progressiva", value: "Progressiva" },
  ],
  Unhas: [
    { label: "Alongamento Gel", value: "Alongamento Gel" },
    { label: "Volume Híbrido", value: "Volume Híbrido" },
    { label: "Volume Russo", value: "Volume Russo" },
    { label: "Esmaltação", value: "Esmaltação" },
  ],
  Estética: [
    { label: "Limpeza de Pele", value: "Limpeza de Pele" },
    { label: "Massagem", value: "Massagem" },
    { label: "Design de Sobrancelha", value: "Design de Sobrancelha" },
    { label: "Depilação", value: "Depilação" },
  ],
};

const procedureTypeOptions = computed(() => {
  if (!categoryFilter.value || categoryFilter.value === "all") return [];
  return procedureTypeByCategory[categoryFilter.value] ?? [];
});

function onCategoryChange(value: string) {
  categoryFilter.value = value;
  procedureTypeFilter.value = "";
}
</script>

<template>
  <!-- Mobile layout -->
  <div class="flex md:hidden flex-col gap-3">
    <UInput
      v-model="search"
      placeholder="Buscar serviço..."
      leading-icon="i-lucide-search"
      class="w-full"
      size="md"
    />
    <div class="flex items-center gap-2">
      <USelect v-model="categoryFilter" :items="categories" class="flex-1" size="md" />
      <UButton icon="i-lucide-plus" size="md" @click="emit('create')">
        Novo
      </UButton>
    </div>
    <USelect
      v-if="categoryFilter && categoryFilter !== 'all'"
      v-model="procedureTypeFilter"
      :items="procedureTypeOptions"
      placeholder="Tipo de procedimento..."
      class="w-full"
      size="sm"
    />
  </div>

  <!-- Desktop layout -->
  <div class="hidden md:flex flex-col gap-3">
    <UDashboardToolbar>
      <template #left>
        <UButtonGroup size="sm" variant="soft" color="neutral">
          <UButton
            v-for="cat in categories"
            :key="cat.value"
            :variant="categoryFilter === cat.value ? 'solid' : 'soft'"
            :color="categoryFilter === cat.value ? 'primary' : 'neutral'"
            @click="onCategoryChange(cat.value)"
          >
            {{ cat.label }}
          </UButton>
        </UButtonGroup>
      </template>

      <template #right>
        <div class="flex items-center gap-3">
          <UInput
            v-model="search"
            placeholder="Buscar serviço..."
            leading-icon="i-lucide-search"
            class="w-64"
            size="md"
          />
          <USelect v-model="categoryFilter" :items="categories" class="w-36" size="md" />
          <UButton icon="i-lucide-plus" size="md" @click="emit('create')">
            + Novo Serviço
          </UButton>
        </div>
      </template>
    </UDashboardToolbar>

    <!-- Procedure type sub-filter -->
    <div v-if="categoryFilter && categoryFilter !== 'all'" class="flex items-center gap-2">
      <span class="text-xs text-muted shrink-0">Tipo:</span>
      <UButtonGroup size="xs" variant="soft" color="neutral">
        <UButton
          :variant="!procedureTypeFilter ? 'solid' : 'soft'"
          :color="!procedureTypeFilter ? 'primary' : 'neutral'"
          @click="procedureTypeFilter = ''"
        >
          Todos
        </UButton>
        <UButton
          v-for="pt in procedureTypeOptions"
          :key="pt.value"
          :variant="procedureTypeFilter === pt.value ? 'solid' : 'soft'"
          :color="procedureTypeFilter === pt.value ? 'primary' : 'neutral'"
          @click="procedureTypeFilter = pt.value"
        >
          {{ pt.label }}
        </UButton>
      </UButtonGroup>
    </div>
  </div>
</template>
