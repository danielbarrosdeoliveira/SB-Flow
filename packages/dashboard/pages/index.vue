<template>
  <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
    <!-- Central content -->
    <div class="xl:col-span-9 space-y-4 lg:space-y-6">
      <!-- KPI row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div
          v-for="kpi in kpis"
          :key="kpi.label"
          class="rounded-xl p-4 border border-[var(--color-warm)]/20"
          style="background-color: color-mix(in srgb, var(--color-warm) 8%, transparent)"
        >
          <div class="flex items-center gap-2">
            <UIcon :name="kpi.icon" class="w-4 h-4 shrink-0" style="color: var(--color-primary)" />
            <span class="text-xs" style="color: var(--color-warm)">{{ kpi.label }}</span>
          </div>
          <p class="mt-2 text-xl lg:text-2xl font-bold" style="color: var(--color-foreground)">{{ kpi.value }}</p>
        </div>
      </div>

      <!-- Chart placeholder -->
      <div
        class="rounded-xl border border-[var(--color-warm)]/20 flex items-center justify-center"
        style="background-color: color-mix(in srgb, var(--color-warm) 5%, transparent); height: 280px"
      >
        <div class="text-center">
          <UIcon name="i-lucide-trending-up" class="w-8 h-8 mx-auto" style="color: var(--color-sand)" />
          <p class="mt-2 text-sm" style="color: var(--color-sand)">Gráfico de Faturamento</p>
        </div>
      </div>

      <!-- Appointments table placeholder -->
      <div
        class="rounded-xl border border-[var(--color-warm)]/20 p-4 lg:p-6"
        style="background-color: color-mix(in srgb, var(--color-warm) 5%, transparent)"
      >
        <h2 class="text-base lg:text-lg font-semibold mb-4" style="color: var(--color-foreground)">Agendamentos de Hoje</h2>
        <div class="space-y-3">
          <div
            v-for="item in appointments"
            :key="item.time"
            class="flex items-center gap-3 lg:gap-4 p-3 rounded-lg"
            style="background-color: color-mix(in srgb, var(--color-warm) 8%, transparent)"
          >
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white" style="background-color: var(--color-primary)">
              {{ item.initials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium truncate" style="color: var(--color-foreground)">{{ item.client }}</p>
              <p class="text-xs lg:text-sm truncate" style="color: var(--color-sand)">{{ item.time }} — {{ item.service }}</p>
            </div>
            <span class="shrink-0 px-2 py-1 rounded-full text-xs font-medium" :class="getStatusClasses(item.status)">{{ item.statusLabel }}</span>
            <span class="text-sm font-medium shrink-0" style="color: var(--color-primary)">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right sidebar -->
    <div class="xl:col-span-3 space-y-4 lg:space-y-6">
      <!-- Mini calendar -->
      <div
        class="rounded-xl border border-[var(--color-warm)]/20 p-4"
        style="background-color: color-mix(in srgb, var(--color-warm) 5%, transparent)"
      >
        <h3 class="text-sm font-semibold mb-3" style="color: var(--color-foreground)">{{ currentMonth }}</h3>
        <div class="grid grid-cols-7 gap-1 text-center text-xs">
          <div v-for="d in weekDays" :key="d" class="py-1 font-medium" style="color: var(--color-sand)">{{ d }}</div>
          <div v-for="day in 30" :key="day" class="py-1 rounded text-xs"
            :style="day === todayDay ? { backgroundColor: 'var(--color-primary)', color: 'white' } : { color: 'var(--color-foreground)' }">
            {{ day }}
          </div>
        </div>
      </div>

      <!-- Activity feed -->
      <div
        class="rounded-xl border border-[var(--color-warm)]/20 p-4"
        style="background-color: color-mix(in srgb, var(--color-warm) 5%, transparent)"
      >
        <h3 class="text-sm font-semibold mb-3" style="color: var(--color-foreground)">Atividades Recentes</h3>
        <div class="space-y-3">
          <div v-for="(activity, i) in activities" :key="i" class="flex gap-3">
            <div class="w-2 h-2 mt-1.5 rounded-full shrink-0" :style="{ backgroundColor: 'var(--color-primary)' }"></div>
            <div class="min-w-0">
              <p class="text-sm truncate" style="color: var(--color-foreground)">{{ activity.text }}</p>
              <p class="text-xs" style="color: var(--color-sand)">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const now = new Date();
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const currentMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
const todayDay = now.getDate();
const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const kpis = [
  { label: "Agendamentos Hoje", value: "12", icon: "i-lucide-calendar-check" },
  { label: "Receita Hoje", value: "R$ 1.840", icon: "i-lucide-trending-up" },
  { label: "Clientes Atendidos", value: "8", icon: "i-lucide-user-check" },
  { label: "Taxa de Ocupação", value: "75%", icon: "i-lucide-clock" },
];

const getStatusClasses = (status: string) => {
  const classes: Record<string, string> = {
    confirmed: "bg-[var(--color-success-light)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20",
    pending: "bg-[var(--color-warning-light)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20",
    canceled: "bg-[var(--color-error-light)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20",
  };
  return classes[status] ?? classes.pending;
};

const appointments = [
  { client: "Ana Silva", time: "09:00", service: "Corte + Escova", value: "R$ 120,00", initials: "AS", status: "confirmed", statusLabel: "Confirmado" },
  { client: "Carla Oliveira", time: "10:30", service: "Coloração", value: "R$ 250,00", initials: "CO", status: "pending", statusLabel: "Aguardando" },
  { client: "Marina Santos", time: "13:00", service: "Manicure", value: "R$ 65,00", initials: "MS", status: "confirmed", statusLabel: "Confirmado" },
  { client: "Juliana Costa", time: "15:00", service: "Progressiva", value: "R$ 350,00", initials: "JC", status: "canceled", statusLabel: "Cancelado" },
];

const activities = [
  { text: "Ana Silva confirmou agendamento", time: "Há 5 min" },
  { text: "Carla Oliveira cancelou horário", time: "Há 12 min" },
  { text: "Nova cliente cadastrada: Marina", time: "Há 25 min" },
  { text: "Agendamento de Juliana remarcado", time: "Há 40 min" },
  { text: "Relatório diário gerado", time: "Há 1h" },
];
</script>
