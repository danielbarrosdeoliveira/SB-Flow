<script setup lang="ts">
const now = new Date();
const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const currentMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
const todayDay = now.getDate();
const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
</script>

<template>
  <UCard class="rounded-xl">
    <h3 class="text-sm font-semibold mb-3">{{ currentMonth }}</h3>
    <div class="grid grid-cols-7 gap-1 text-center text-xs">
      <div v-for="d in weekDays" :key="d" class="py-1 font-medium text-muted">{{ d }}</div>
      <div v-for="d in firstDayOfWeek" :key="'empty-' + d" class="py-1" />
      <div
        v-for="day in daysInMonth" :key="day"
        class="py-1 rounded text-xs"
        :class="day === todayDay ? 'bg-primary text-primary-950' : 'text-foreground'"
      >
        {{ day }}
      </div>
    </div>
  </UCard>
</template>
