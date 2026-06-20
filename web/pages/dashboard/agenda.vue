<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Agenda</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ auth.user?.name }} ({{ auth.user?.role }})</span>
          <button
            @click="handleLogout"
            class="text-sm text-red-600 hover:text-red-700"
          >
            Sair
          </button>
        </div>
      </div>
      <p class="text-gray-500">Em breve: calendário semanal com agendamentos.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const router = useRouter();

async function handleLogout() {
  await auth.logout();
  await router.push("/login");
}
</script>
