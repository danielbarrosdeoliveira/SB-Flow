<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Agenda</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">
            {{ auth.user?.name }} ({{ auth.user?.role }})
          </span>
          <button @click="handleLogout" class="text-sm text-red-600 hover:text-red-700">
            Sair
          </button>
        </div>
      </div>

      <div v-if="status === 'pending'">Carregando...</div>

      <div v-else-if="error">
        <p class="text-red-500">{{ error }}</p>
      </div>

      <div v-else-if="(appointments ?? []).length === 0">
        <p class="text-gray-500">Nenhum agendamento para hoje.</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="apt in appointments"
          :key="apt.id"
          class="bg-white rounded-lg shadow-sm border p-4"
        >
          <div class="font-medium">{{ apt.clientName }}</div>
          <div class="text-sm text-gray-600">{{ apt.serviceName }}</div>
          <div class="text-xs text-gray-400">
            {{ formatTime(apt.startTime) }} — {{ formatTime(apt.endTime) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryClient, useQuery } from "@tanstack/vue-query";
import { api } from "../../utils/api";
import type { Appointment } from "../../composables/use-appointments";

definePageMeta({
  middleware: "auth" as any,
});

const auth = useAuthStore();
const router = useRouter();
const today = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
});

// SSR: prefetch no servidor → dehydrated → enviado no payload
const queryClient = useQueryClient();

const { data: serverData } = await useAsyncData(
  "agenda-today",
  async () => {
    await queryClient.prefetchQuery({
      queryKey: ["appointments", today.value],
      queryFn: () =>
        api.get<Appointment[]>(`/api/appointments?date=${today.value}`),
    });
  },
  { server: true },
);

// Cliente: lê do cache (hidratado automaticamente)
const {
  data: appointments,
  status,
  error,
} = useQuery<Appointment[]>({
  queryKey: ["appointments", today],
  queryFn: () => api.get<Appointment[]>(`/api/appointments?date=${today.value}`),
});

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function handleLogout() {
  await auth.logout();
  await router.push("/login");
}
</script>
