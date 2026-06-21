<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="auto">
        <v-text-field
          v-model="selectedDate"
          type="date"
          variant="outlined"
          density="compact"
          hide-details
          class="w-[240px]"
        />
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
        <span class="text-body-2 text-medium-emphasis">
          {{ formatDate(selectedDate) }}
        </span>
      </v-col>
    </v-row>

    <v-card class="mb-6">
      <v-card-title class="d-flex align-center">
        <v-icon start>mdi-calendar-check</v-icon>
        Agendamentos
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="aptStatus === 'pending'"
          type="info"
          variant="tonal"
          text="Carregando..."
        />
        <v-alert
          v-else-if="aptError"
          type="error"
          variant="tonal"
          :text="String(aptError)"
        />
        <v-alert
          v-else-if="(appointments ?? []).length === 0"
          type="info"
          variant="tonal"
          text="Nenhum agendamento para esta data."
        />
        <v-list v-else lines="one">
          <v-list-item
            v-for="apt in appointments"
            :key="apt.id"
            :title="apt.clientName"
            :subtitle="apt.serviceName"
          >
            <template #append>
              <span class="text-caption text-medium-emphasis">
                {{ formatTime(apt.startTime) }} — {{ formatTime(apt.endTime) }}
              </span>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon start>mdi-lock</v-icon>
        Bloqueios
        <v-spacer />
        <v-btn
          color="primary"
          size="small"
          prepend-icon="mdi-plus"
          @click="openCreateBlockModal"
        >
          Novo Bloqueio
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="blocksStatus === 'pending'"
          type="info"
          variant="tonal"
          text="Carregando..."
        />
        <v-alert
          v-else-if="blocksError"
          type="error"
          variant="tonal"
          :text="String(blocksError)"
        />
        <v-alert
          v-else-if="(blocks ?? []).length === 0"
          type="info"
          variant="tonal"
          text="Nenhum bloqueio para esta data."
        />
        <v-list v-else lines="two">
          <v-list-item
            v-for="block in blocks"
            :key="block.id"
            :title="block.reason || 'Sem motivo'"
            :subtitle="`${formatTime(block.startTime)} — ${formatTime(block.endTime)}`"
          >
            <template #prepend>
              <v-icon color="error">mdi-lock</v-icon>
            </template>
            <template #append>
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                size="small"
                @click="confirmDeleteBlock(block)"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Create Block Dialog -->
    <v-dialog v-model="showBlockModal" max-width="500">
      <v-card>
        <v-card-title>Novo Bloqueio</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleCreateBlock">
            <v-select
              v-if="auth.user?.role === 'OWNER'"
              v-model="blockForm.professionalId"
              :items="professionals ?? []"
              item-title="name"
              item-value="id"
              label="Profissional"
              variant="outlined"
              density="compact"
              class="mb-3"
              required
            />

            <v-text-field
              v-model="blockForm.date"
              type="date"
              label="Data"
              variant="outlined"
              density="compact"
              class="mb-3"
              required
            />

            <v-switch
              v-model="blockForm.allDay"
              label="Dia inteiro"
              color="primary"
              hide-details
              class="mb-3"
            />

            <v-row v-if="!blockForm.allDay">
              <v-col cols="6">
                <v-text-field
                  v-model="blockForm.startTime"
                  type="time"
                  label="Início"
                  variant="outlined"
                  density="compact"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="blockForm.endTime"
                  type="time"
                  label="Fim"
                  variant="outlined"
                  density="compact"
                  required
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="blockForm.reason"
              label="Motivo"
              variant="outlined"
              density="compact"
              maxlength="500"
              class="mb-3"
            />

            <v-alert
              v-if="blockSaveError"
              type="error"
              variant="tonal"
              :text="blockSaveError"
              class="mb-3"
            />
            <v-alert
              v-if="blockWarning"
              type="warning"
              variant="tonal"
              :text="blockWarning"
              class="mb-3"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeBlockModal">Cancelar</v-btn>
          <v-btn
            color="primary"
            :loading="blockSaving"
            @click="handleCreateBlock"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Block Confirmation -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Remover Bloqueio</v-card-title>
        <v-card-text>
          Deseja remover este bloqueio{{ deletingBlock?.reason ? `: "${deletingBlock.reason}"` : '' }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deletingBlock = null">Cancelar</v-btn>
          <v-btn
            color="error"
            :loading="blockDeleting"
            @click="handleDeleteBlock"
          >
            Remover
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

import { useQuery, useQueryClient } from "@tanstack/vue-query";
import type { Appointment } from "~/composables/use-appointments";
import { useSSE } from "~/composables/use-sse";
import { useAuthStore } from "~/stores/auth";
import { api } from "~/utils/api";

interface Block {
  id: number;
  professionalId: number;
  startTime: string;
  endTime: string;
  reason: string | null;
}

interface Professional {
  id: number;
  name: string;
}

const auth = useAuthStore();
const queryClient = useQueryClient();

const todayStr = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
});
const selectedDate = ref(todayStr.value);

// SSE — real-time updates
const { connect: connectSSE, disconnect: disconnectSSE } = useSSE();
onMounted(() => connectSSE());
onUnmounted(() => disconnectSSE());

// Appointments
const {
  data: appointments,
  status: aptStatus,
  error: aptError,
} = useQuery<Appointment[]>({
  queryKey: ["appointments", selectedDate],
  queryFn: () => api.get<Appointment[]>(`/api/appointments?date=${selectedDate.value}`),
});

// Blocks
const {
  data: blocksData,
  status: blocksStatus,
  error: blocksError,
} = useQuery<Block[]>({
  queryKey: ["blocks", selectedDate],
  queryFn: () =>
    api.get<Block[]>(
      `/api/blocks?start=${selectedDate.value}T00:00:00&end=${selectedDate.value}T23:59:59`,
    ),
});
const blocks = computed(() => blocksData.value ?? []);

// Professionals list for OWNER
const { data: professionals } = useQuery<Professional[]>({
  queryKey: ["professionals"],
  queryFn: () => api.get<Professional[]>("/api/professionals"),
  enabled: computed(() => auth.user?.role === "OWNER"),
});

// Block form
const showBlockModal = ref(false);
const blockSaving = ref(false);
const blockSaveError = ref("");
const blockWarning = ref("");

const blockForm = reactive({
  professionalId: "",
  date: "",
  startTime: "08:00",
  endTime: "09:00",
  reason: "",
  allDay: false,
});

function resetBlockForm() {
  blockForm.professionalId = "";
  blockForm.date = selectedDate.value;
  blockForm.startTime = "08:00";
  blockForm.endTime = "09:00";
  blockForm.reason = "";
  blockForm.allDay = false;
  blockSaveError.value = "";
  blockWarning.value = "";
}

function openCreateBlockModal() {
  resetBlockForm();
  showBlockModal.value = true;
}

function closeBlockModal() {
  showBlockModal.value = false;
}

async function handleCreateBlock() {
  blockSaving.value = true;
  blockSaveError.value = "";
  blockWarning.value = "";

  try {
    const startTime = blockForm.allDay
      ? `${blockForm.date}T00:00:00`
      : `${blockForm.date}T${blockForm.startTime}:00`;
    const endTime = blockForm.allDay
      ? `${blockForm.date}T23:45:00`
      : `${blockForm.date}T${blockForm.endTime}:00`;

    const body: Record<string, unknown> = {
      startTime,
      endTime,
      reason: blockForm.reason || undefined,
      allDay: blockForm.allDay,
    };

    if (auth.user?.role === "OWNER" && blockForm.professionalId) {
      body.professionalId = Number(blockForm.professionalId);
    }

    const result = await api.post<{ block: Block; warning?: string }>("/api/blocks", body);

    if (result.warning) {
      blockWarning.value = result.warning;
    }

    await queryClient.invalidateQueries({ queryKey: ["blocks"] });
    closeBlockModal();
  } catch (err: unknown) {
    blockSaveError.value = err instanceof Error ? err.message : "Erro ao criar bloqueio";
  } finally {
    blockSaving.value = false;
  }
}

// Delete block
const deletingBlock = ref<Block | null>(null);
const blockDeleting = ref(false);
const showDeleteDialog = computed({
  get: () => deletingBlock.value !== null,
  set: (v) => { if (!v) deletingBlock.value = null; },
});

function confirmDeleteBlock(block: Block) {
  deletingBlock.value = block;
}

async function handleDeleteBlock() {
  if (!deletingBlock.value) return;
  blockDeleting.value = true;

  try {
    await api.delete(`/api/blocks/${deletingBlock.value.id}`);
    await queryClient.invalidateQueries({ queryKey: ["blocks"] });
    deletingBlock.value = null;
  } catch (err: unknown) {
    console.error("Erro ao remover bloqueio:", err);
  } finally {
    blockDeleting.value = false;
  }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
</script>
