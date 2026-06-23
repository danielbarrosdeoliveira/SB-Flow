<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="font-serif text-2xl text-(--color-primary-light) mb-6">Painel de Gerenciamento</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink v-for="card in cards" :key="card.to" :to="card.to"
        class="rounded-xl border border-(--color-warm)/20 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-(--color-primary)/40">
        <div class="text-lg font-semibold text-(--color-primary-light)">{{ card.title }}</div>
        <p class="mt-1 text-sm text-(--color-sand)/70">{{ card.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const cards = [
  { title: "Agenda", description: "Gerenciar agendamentos", to: "/dashboard/agenda" },
  { title: "Clientes", description: "Gerenciar clientes", to: "/dashboard/clientes" },
  { title: "Profissionais", description: "Gerenciar profissionais", to: "/dashboard/profissionais" },
  { title: "Serviços", description: "Gerenciar serviços", to: "/dashboard/servicos" },
];
</script>
