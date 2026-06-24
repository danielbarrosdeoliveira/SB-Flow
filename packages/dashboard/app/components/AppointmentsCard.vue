<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

interface Appointment {
  client: string;
  time: string;
  service: string;
  value: string;
  initials: string;
  status: "confirmed" | "pending" | "canceled";
  statusLabel: string;
}

defineProps<{
  appointments: Appointment[];
}>();

const statusColor: Record<Appointment["status"], "success" | "warning" | "error"> = {
  confirmed: "success",
  pending: "warning",
  canceled: "error",
};

const columns: TableColumn<Appointment>[] = [
  { id: "client", accessorKey: "client", header: "Cliente" },
  { id: "service", accessorKey: "service", header: "Serviço" },
  { id: "time", accessorKey: "time", header: "Horário" },
  { id: "status", accessorKey: "status", header: "Status" },
  { id: "value", accessorKey: "value", header: "Valor" },
];
</script>

<template>
  <UCard class="rounded-xl">
    <h2 class="text-base lg:text-lg font-semibold">Agendamentos de Hoje</h2>

    <UTable :data="appointments" :columns="columns" class="min-w-125">
      <template #status-cell="{ row }">
        <UBadge :color="statusColor[row.original.status]" variant="subtle" :label="row.original.statusLabel" />
      </template>

      <template #value-cell="{ row }">
        <span class="font-mono text-foreground">{{ row.original.value }}</span>
      </template>
    </UTable>
  </UCard>
</template>