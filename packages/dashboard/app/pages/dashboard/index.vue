<template>
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
    <!-- Central content -->
    <div class="xl:col-span-9 space-y-4 lg:space-y-6">
      <!-- KPI row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div v-for="kpi in kpis" :key="kpi.label" class="rounded-xl p-4 border border-warm-200 bg-warm-200">
          <div class="flex items-center gap-2">
            <UIcon :name="kpi.icon" class="w-5 h-5 shrink-0 text-primary" />
            <span class="text-warm-600">{{ kpi.label }}</span>
          </div>
          <p class="mt-2 text-xl lg:text-2xl font-bold text-warm-950">{{ kpi.value }}</p>
        </div>
      </div>

      <!-- Chart placeholder -->
      <div class="rounded-xl border border-warm-200 bg-warm-100 flex items-center justify-center h-70">
        <div class="text-center">
          <UIcon name="i-lucide-trending-up" class="w-8 h-8 mx-auto text-warm-600" />
          <p class="mt-2 text-sm text-warm-600">Gráfico de Faturamento</p>
        </div>
      </div>

      <AppointmentsCard :appointments="appointments" />
    </div>

    <!-- Right sidebar -->
    <div class="xl:col-span-3 space-y-4 lg:space-y-6">
      <!-- Mini calendar -->
      <div class="rounded-xl border border-warm-200 p-4 bg-warm-100">
        <h3 class="text-sm font-semibold mb-3 text-warm-950">{{ currentMonth }}</h3>
        <div class="grid grid-cols-7 gap-1 text-center text-xs">
          <div v-for="d in weekDays" :key="d" class="py-1 font-medium text-warm-600">{{ d }}</div>
          <div v-for="day in 30" :key="day" class="py-1 rounded text-xs"
            :class="day === todayDay ? 'bg-primary text-primary-950' : 'text-warm-950'">
            {{ day }}
          </div>
        </div>
      </div>

      <!-- Activity feed -->
      <div class="rounded-xl border border-warm-200 p-4 bg-warm-100">
        <h3 class="text-sm font-semibold mb-3 text-warm-950">Atividades Recentes</h3>
        <div class="space-y-3">
          <div v-for="(activity, i) in activities" :key="i" class="flex gap-3">
            <div class="w-2 h-2 mt-1.5 rounded-full shrink-0 bg-primary"></div>
            <div class="min-w-0">
              <p class="text-sm truncate text-warm-950">{{ activity.text }}</p>
              <p class="text-xs text-warm-600">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import authMiddleware from "~/features/auth/middleware/auth";

definePageMeta({
  layout: "dashboard",
  middleware: authMiddleware,
});

const now = new Date();
const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const currentMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
const todayDay = now.getDate();
const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const kpis = [
  { label: "Agendamentos Hoje", value: "12", icon: "i-lucide-calendar-check" },
  { label: "Receita Hoje", value: "R$ 1.840", icon: "i-lucide-trending-up" },
  { label: "Clientes Atendidos", value: "8", icon: "i-lucide-user-check" },
  { label: "Taxa de Ocupação", value: "75%", icon: "i-lucide-clock" },
];

const appointments = [
  {
    client: "Ana Silva",
    time: "09:00",
    service: "Corte + Escova",
    value: "R$ 120,00",
    initials: "AS",
    status: "confirmed" as const,
    statusLabel: "Confirmado",
  },
  {
    client: "Carla Oliveira",
    time: "10:30",
    service: "Coloração",
    value: "R$ 250,00",
    initials: "CO",
    status: "pending" as const,
    statusLabel: "Aguardando",
  },
  {
    client: "Marina Santos",
    time: "13:00",
    service: "Manicure",
    value: "R$ 65,00",
    initials: "MS",
    status: "confirmed" as const,
    statusLabel: "Confirmado",
  },
  {
    client: "Juliana Costa",
    time: "15:00",
    service: "Progressiva",
    value: "R$ 350,00",
    initials: "JC",
    status: "canceled" as const,
    statusLabel: "Cancelado",
  },
];

const activities = [
  { text: "Ana Silva confirmou agendamento", time: "Há 5 min" },
  { text: "Carla Oliveira cancelou horário", time: "Há 12 min" },
  { text: "Nova cliente cadastrada: Marina", time: "Há 25 min" },
  { text: "Agendamento de Juliana remarcado", time: "Há 40 min" },
  { text: "Relatório diário gerado", time: "Há 1h" },
];
</script>