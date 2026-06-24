<script setup lang="ts">
const search = defineModel<string>("search", { required: true });
const statusFilter = defineModel<"all" | "active" | "inactive">("statusFilter", { required: true });

const emit = defineEmits<{
  create: [];
}>();

const statusOptions = [
  { label: "Todos", value: "all" },
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
];
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div class="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <UInput
        v-model="search"
        placeholder="Buscar profissional..."
        leading-icon="i-lucide-search"
        class="w-full sm:w-72"
        size="md"
      />
      <USelect v-model="statusFilter" :items="statusOptions" class="w-full sm:w-40" size="md" />
    </div>
    <UButton icon="i-lucide-plus" size="md" @click="emit('create')">
      Novo Profissional
    </UButton>
  </div>
</template>
