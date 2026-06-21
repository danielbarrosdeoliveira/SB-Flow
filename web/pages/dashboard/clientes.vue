<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Clientes</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ auth.user?.name }} ({{ auth.user?.role }})</span>
          <button
            v-if="auth.user?.role === 'OWNER'"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            @click="openCreateModal"
          >
            + Novo Cliente
          </button>
          <NuxtLink to="/dashboard/agenda" class="text-sm text-gray-600 hover:text-gray-800">
            Agenda
          </NuxtLink>
          <NuxtLink to="/dashboard/servicos" class="text-sm text-gray-600 hover:text-gray-800">
            Serviços
          </NuxtLink>
          <button class="text-sm text-red-600 hover:text-red-700" @click="handleLogout">Sair</button>
        </div>
      </div>

      <!-- Search -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          placeholder="Buscar por nome ou telefone..."
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="onSearchInput"
        />
      </div>

      <div v-if="status === 'pending'" class="text-center py-8 text-gray-500">Carregando...</div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {{ error }}
      </div>

      <div v-else-if="clients.length === 0" class="text-center py-8 text-gray-500">
        {{ searchQuery ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.' }}
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="client in clients"
          :key="client.id"
          class="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between"
        >
          <div>
            <div class="font-medium">{{ client.name }}</div>
            <div class="text-sm text-gray-500">{{ formatPhone(client.phone) }}</div>
          </div>
          <div v-if="auth.user?.role === 'OWNER'" class="flex items-center gap-2">
            <button class="text-sm text-blue-600 hover:text-blue-700" @click="openEditModal(client)">
              Editar
            </button>
            <button class="text-sm text-gray-600 hover:text-gray-700" @click="viewHistory(client)">
              Histórico
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-lg font-bold mb-4">{{ editingClient ? 'Editar Cliente' : 'Novo Cliente' }}</h2>

        <form @submit.prevent="handleSave">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              v-model="form.name"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': formErrors.name }"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              v-model="formPhoneMasked"
              type="tel"
              placeholder="(11) 98888-0015"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': formErrors.phone }"
              @input="handlePhoneInput"
            />
          </div>

          <p v-if="saveError" class="text-red-500 text-sm mb-4">{{ saveError }}</p>

          <div class="flex justify-end gap-3">
            <button type="button" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" @click="closeModal">
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- History Modal -->
    <div v-if="historyClient" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="historyClient = null">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-4">
        <h2 class="text-lg font-bold mb-4">Histórico — {{ historyClient.name }}</h2>
        <div v-if="historyLoading" class="text-gray-500 text-sm">Carregando...</div>
        <div v-else-if="historyAppointments.length === 0" class="text-gray-500 text-sm">
          Nenhum atendimento registrado.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="apt in historyAppointments"
            :key="apt.id"
            class="text-sm border rounded-lg p-3"
          >
            <div class="font-medium">{{ apt.serviceName }}</div>
            <div class="text-gray-500">{{ new Date(apt.startTime).toLocaleString('pt-BR') }}</div>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" @click="historyClient = null">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useAuthStore } from "../../stores/auth";
import { api } from "../../utils/api";
import { maskPhone, normalizePhone, unmaskPhone } from "../../utils/phone";

definePageMeta({
  middleware: "auth" as any,
});

interface Client {
  id: number;
  name: string;
  phone: string;
}

interface Appointment {
  id: number;
  startTime: string;
  serviceName: string;
}

const auth = useAuthStore();
const router = useRouter();
const queryClient = useQueryClient();

const searchQuery = ref("");
const searchDebounce = ref<ReturnType<typeof setTimeout> | null>(null);
const showModal = ref(false);
const editingClient = ref<Client | null>(null);
const saving = ref(false);
const saveError = ref("");
const historyClient = ref<Client | null>(null);
const historyLoading = ref(false);
const historyAppointments = ref<Appointment[]>([]);

const form = reactive({
  name: "",
  phone: "",
});
const formPhoneMasked = ref("");
const formErrors = reactive({
  name: "",
  phone: "",
});

const {
  data: clientsData,
  status,
  error,
  refetch,
} = useQuery<Client[]>({
  queryKey: ["clients", searchQuery],
  queryFn: () => {
    const query = searchQuery.value ? `?q=${encodeURIComponent(searchQuery.value)}` : "";
    return api.get<Client[]>(`/api/clients${query}`);
  },
});

const clients = computed(() => clientsData.value ?? []);

function onSearchInput() {
  if (searchDebounce.value) clearTimeout(searchDebounce.value);
  searchDebounce.value = setTimeout(() => {
    refetch();
  }, 300);
}

function resetForm() {
  form.name = "";
  form.phone = "";
  formPhoneMasked.value = "";
  formErrors.name = "";
  formErrors.phone = "";
  saveError.value = "";
}

function openCreateModal() {
  editingClient.value = null;
  resetForm();
  showModal.value = true;
}

function openEditModal(client: Client) {
  editingClient.value = client;
  form.name = client.name;
  form.phone = client.phone;
  formPhoneMasked.value = maskPhone(client.phone);
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingClient.value = null;
}

function handlePhoneInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.phone = unmaskPhone(target.value);
  formPhoneMasked.value = maskPhone(target.value);
}

async function handleSave() {
  saving.value = true;
  saveError.value = "";

  try {
    const phone = normalizePhone(form.phone);

    if (editingClient.value) {
      await api.put(`/api/clients/${editingClient.value.id}`, {
        name: form.name,
        phone,
      });
    } else {
      await api.post("/api/clients", {
        name: form.name,
        phone,
      });
    }

    await queryClient.invalidateQueries({ queryKey: ["clients"] });
    closeModal();
  } catch (err: unknown) {
    saveError.value = err instanceof Error ? err.message : "Erro ao salvar";
  } finally {
    saving.value = false;
  }
}

async function viewHistory(client: Client) {
  historyClient.value = client;
  historyLoading.value = true;
  historyAppointments.value = [];

  try {
    const data = await api.get<{ client: Client; appointments: Appointment[] }>(
      `/api/clients/${client.id}/history`,
    );
    historyAppointments.value = data.appointments ?? [];
  } catch {
    historyAppointments.value = [];
  } finally {
    historyLoading.value = false;
  }
}

function formatPhone(phone: string): string {
  return maskPhone(phone);
}

async function handleLogout() {
  await auth.logout();
  await router.push("/login");
}
</script>
