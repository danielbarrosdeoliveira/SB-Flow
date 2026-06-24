<script setup lang="ts">
const search = defineModel<string>("search", { required: true });

const emit = defineEmits<{
  create: [];
}>();
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div class="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <UInput
        v-model="search"
        placeholder="Buscar cliente..."
        leading-icon="i-lucide-search"
        class="w-full sm:w-72"
        size="md"
      />
    </div>
    <UButton icon="i-lucide-plus" size="md" @click="emit('create')">
      Novo Cliente
    </UButton>
  </div>
</template>
