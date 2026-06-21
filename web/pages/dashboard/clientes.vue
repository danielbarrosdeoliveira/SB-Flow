<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="searchQuery"
          placeholder="Buscar por nome ou telefone..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          @input="onSearchInput"
        />
      </v-col>
      <v-col cols="12" sm="6" class="d-flex align-center justify-sm-end">
        <v-btn
          v-if="auth.user?.role === 'OWNER'"
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateModal"
        >
          Novo Cliente
        </v-btn>
      </v-col>
    </v-row>

    <v-alert
      v-if="status === 'pending'"
      type="info"
      variant="tonal"
      text="Carregando..."
    />
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      :text="String(error)"
    />
    <v-alert
      v-else-if="clients.length === 0"
      type="info"
      variant="tonal"
      :text="searchQuery ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'"
    />

    <v-card v-else variant="outlined">
      <v-list lines="two">
        <v-list-item
          v-for="client in clients"
          :key="client.id"
          :title="client.name"
          :subtitle="formatPhone(client.phone)"
        >
          <template #prepend>
            <v-avatar color="primary" variant="tonal">
              <span class="text-uppercase">{{ client.name.charAt(0) }}</span>
            </v-avatar>
          </template>
          <template v-if="auth.user?.role === 'OWNER'" #append>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              @click="openEditModal(client)"
            />
            <v-btn
              icon="mdi-history"
              variant="text"
              size="small"
              @click="viewHistory(client)"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="showModal" max-width="500">
      <v-card>
        <v-card-title>{{ editingClient ? 'Editar Cliente' : 'Novo Cliente' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSave">
            <v-text-field
              v-model="form.name"
              label="Nome"
              variant="outlined"
              density="compact"
              class="mb-3"
              :error="!!formErrors.name"
              :error-messages="formErrors.name"
              required
            />

            <v-text-field
              v-model="formPhoneMasked"
              label="Telefone"
              placeholder="(11) 98888-0015"
              variant="outlined"
              density="compact"
              type="tel"
              class="mb-3"
              :error="!!formErrors.phone"
              :error-messages="formErrors.phone"
              @input="handlePhoneInput"
            />

            <v-alert
              v-if="saveError"
              type="error"
              variant="tonal"
              :text="saveError"
              class="mb-3"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeModal">Cancelar</v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            @click="handleSave"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- History Dialog -->
    <v-dialog v-model="showHistoryDialog" max-width="600">
      <v-card>
        <v-card-title>Histórico — {{ historyClient?.name }}</v-card-title>
        <v-card-text>
          <v-alert
            v-if="historyLoading"
            type="info"
            variant="tonal"
            text="Carregando..."
          />
          <v-alert
            v-else-if="historyAppointments.length === 0"
            type="info"
            variant="tonal"
            text="Nenhum atendimento registrado."
          />
          <v-list v-else lines="two">
            <v-list-item
              v-for="apt in historyAppointments"
              :key="apt.id"
              :title="apt.serviceName"
              :subtitle="new Date(apt.startTime).toLocaleString('pt-BR')"
            >
              <template #prepend>
                <v-icon>mdi-calendar-check</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="historyClient = null">Fechar</v-btn>
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
import { useAuthStore } from "~/stores/auth";
import { api } from "~/utils/api";
import { maskPhone, normalizePhone, unmaskPhone } from "~/utils/phone";

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
const showHistoryDialog = computed({
  get: () => historyClient.value !== null,
  set: (v) => { if (!v) historyClient.value = null; },
});

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
</script>
