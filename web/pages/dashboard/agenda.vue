<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Agenda</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">
            {{ auth.user?.name }} ({{ auth.user?.role }})
          </span>
          <NuxtLink to="/dashboard/profissionais" class="text-sm text-gray-600 hover:text-gray-800">
            Profissionais
          </NuxtLink>
          <NuxtLink to="/dashboard/clientes" class="text-sm text-gray-600 hover:text-gray-800">
            Clientes
          </NuxtLink>
          <NuxtLink to="/dashboard/servicos" class="text-sm text-gray-600 hover:text-gray-800">
            Serviços
          </NuxtLink>
          <button class="text-sm text-red-600 hover:text-red-700" @click="handleLogout">Sair</button>
        </div>
      </div>

      <!-- Date selector -->
      <div class="flex items-center gap-4 mb-6">
        <input
          v-model="selectedDate"
          type="date"
          class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-sm text-gray-500">{{ formatDate(selectedDate) }}</span>
      </div>

      <!-- Appointments -->
      <h2 class="text-lg font-semibold mb-3">Agendamentos</h2>
      <div v-if="aptStatus === 'pending'" class="text-center py-4 text-gray-500">Carregando...</div>
      <div v-else-if="aptError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
        {{ aptError }}
      </div>
      <div v-else-if="(appointments ?? []).length === 0" class="text-center py-4 text-gray-500 mb-6">
        Nenhum agendamento para esta data.
      </div>
      <div v-else class="space-y-3 mb-8">
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

      <!-- Blocks -->
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">Bloqueios</h2>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          @click="openCreateBlockModal"
        >
          + Novo Bloqueio
        </button>
      </div>
      <div v-if="blocksStatus === 'pending'" class="text-center py-4 text-gray-500">Carregando...</div>
      <div v-else-if="blocksError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
        {{ blocksError }}
      </div>
      <div v-else-if="(blocks ?? []).length === 0" class="text-center py-4 text-gray-500 mb-6">
        Nenhum bloqueio para esta data.
      </div>
      <div v-else class="space-y-3 mb-8">
        <div
          v-for="block in blocks"
          :key="block.id"
          class="bg-white rounded-lg shadow-sm border-l-4 border-l-red-400 border p-4 flex items-center justify-between"
        >
          <div>
            <div class="font-medium">{{ block.reason || 'Sem motivo' }}</div>
            <div class="text-xs text-gray-400">
              {{ formatTime(block.startTime) }} — {{ formatTime(block.endTime) }}
            </div>
          </div>
          <button
            class="text-sm text-red-600 hover:text-red-700"
            @click="confirmDeleteBlock(block)"
          >
            Remover
          </button>
        </div>
      </div>
    </div>

    <!-- Create Block Modal -->
    <div v-if="showBlockModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="closeBlockModal">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-lg font-bold mb-4">Novo Bloqueio</h2>

        <form @submit.prevent="handleCreateBlock">
          <div v-if="auth.user?.role === 'OWNER'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
            <select
              v-model="blockForm.professionalId"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Selecione...</option>
              <option v-for="p in (professionals ?? [])" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              v-model="blockForm.date"
              type="date"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div class="flex items-center gap-3 mb-4">
            <input v-model="blockForm.allDay" type="checkbox" id="allDay" />
            <label for="allDay" class="text-sm text-gray-700">Dia inteiro</label>
          </div>

          <div v-if="!blockForm.allDay" class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Início</label>
              <input
                v-model="blockForm.startTime"
                type="time"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fim</label>
              <input
                v-model="blockForm.endTime"
                type="time"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
            <input
              v-model="blockForm.reason"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxlength="500"
            />
          </div>

          <p v-if="blockSaveError" class="text-red-500 text-sm mb-4">{{ blockSaveError }}</p>
          <p v-if="blockWarning" class="text-yellow-600 text-sm mb-4 bg-yellow-50 border border-yellow-200 rounded p-2">
            {{ blockWarning }}
          </p>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              @click="closeBlockModal"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="blockSaving"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {{ blockSaving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Block Confirmation -->
    <div v-if="deletingBlock" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="deletingBlock = null">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
        <h3 class="text-lg font-bold mb-2">Remover Bloqueio</h3>
        <p class="text-gray-600 text-sm mb-6">
          Deseja remover este bloqueio{{ deletingBlock.reason ? `: "${deletingBlock.reason}"` : '' }}?
        </p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            @click="deletingBlock = null"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
            :disabled="blockDeleting"
            @click="handleDeleteBlock"
          >
            {{ blockDeleting ? 'Removendo...' : 'Remover' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryClient, useQuery } from "@tanstack/vue-query";
import { api } from "../../utils/api";
import { useAuthStore } from "../../stores/auth";
import type { Appointment } from "../../composables/use-appointments";

definePageMeta({
  middleware: "auth" as any,
});

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
const router = useRouter();
const queryClient = useQueryClient();

const todayStr = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
});
const selectedDate = ref(todayStr.value);

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
  queryFn: () => api.get<Block[]>(`/api/blocks?start=${selectedDate.value}T00:00:00&end=${selectedDate.value}T23:59:59`),
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

async function handleLogout() {
  await auth.logout();
  await router.push("/login");
}
</script>
