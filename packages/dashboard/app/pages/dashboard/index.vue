<script setup lang="ts">
import authMiddleware from "~/features/auth/middleware/auth";

definePageMeta({
  layout: "dashboard",
  middleware: authMiddleware,
});

const kpis = [
  { label: "Agendamentos Hoje", value: "12", icon: "i-lucide-calendar-check" },
  { label: "Receita Hoje", value: "R$ 1.840", icon: "i-lucide-trending-up" },
  { label: "Clientes Atendidos", value: "8", icon: "i-lucide-user-check" },
  { label: "Taxa de Ocupação", value: "75%", icon: "i-lucide-clock" },
];

const appointments = [
  { client: "Ana Silva", time: "09:00", service: "Corte + Escova", value: "R$ 120,00", initials: "AS", status: "confirmed" as const, statusLabel: "Confirmado" },
  { client: "Carla Oliveira", time: "10:30", service: "Coloração", value: "R$ 250,00", initials: "CO", status: "pending" as const, statusLabel: "Aguardando" },
  { client: "Marina Santos", time: "13:00", service: "Manicure", value: "R$ 65,00", initials: "MS", status: "confirmed" as const, statusLabel: "Confirmado" },
  { client: "Juliana Costa", time: "15:00", service: "Progressiva", value: "R$ 350,00", initials: "JC", status: "canceled" as const, statusLabel: "Cancelado" },
];

const activities = [
  { text: "Ana Silva confirmou agendamento", time: "Há 5 min" },
  { text: "Carla Oliveira cancelou horário", time: "Há 12 min" },
  { text: "Nova cliente cadastrada: Marina", time: "Há 25 min" },
  { text: "Agendamento de Juliana remarcado", time: "Há 40 min" },
  { text: "Relatório diário gerado", time: "Há 1h" },
];
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
    <div class="xl:col-span-9 space-y-4 lg:space-y-6">
      <DashboardKpis :kpis="kpis" />
      <AppointmentsCard :appointments="appointments" />
    </div>

    <div class="xl:col-span-3 space-y-4 lg:space-y-6">
      <MiniCalendar />
      <ActivityFeed :activities="activities" />
    </div>
  </div>
</template>
