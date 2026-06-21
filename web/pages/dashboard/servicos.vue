<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" sm="6" class="d-flex align-center">
        <span class="text-h6 font-weight-regular">Gerenciar Serviços</span>
      </v-col>
      <v-col cols="12" sm="6" class="d-flex align-center justify-sm-end">
        <v-btn
          v-if="auth.user?.role === 'OWNER'"
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateModal"
        >
          Novo Serviço
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
      v-else-if="(servicesData ?? []).length === 0"
      type="info"
      variant="tonal"
      text="Nenhum serviço cadastrado."
    />

    <div v-else class="d-flex flex-column ga-4">
      <v-card
        v-for="group in groupedServices"
        :key="group.professionalId"
        variant="outlined"
      >
        <v-card-title class="bg-surface-light">
          {{ group.professionalName }}
        </v-card-title>

        <v-list lines="three">
          <v-list-item
            v-for="svc in group.items"
            :key="svc.id"
            :title="svc.name"
          >
            <template #subtitle>
              <span>{{ svc.durationMinutes }}min · R$ {{ svc.price }}</span>
              <br v-if="svc.description" />
              <span v-if="svc.description" class="text-caption">{{ svc.description }}</span>
            </template>

            <template #append>
              <v-chip
                v-if="!svc.isActive"
                size="x-small"
                variant="tonal"
                color="grey"
                class="mr-2"
              >
                Inativo
              </v-chip>
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="openEditModal(svc)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="confirmDelete(svc)"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </div>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="showModal" max-width="500">
      <v-card>
        <v-card-title>{{ editingService ? 'Editar Serviço' : 'Novo Serviço' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSave">
            <v-select
              v-if="auth.user?.role === 'OWNER'"
              v-model="form.professionalId"
              :items="professionalsData ?? []"
              item-title="name"
              item-value="id"
              label="Profissional"
              variant="outlined"
              density="compact"
              class="mb-3"
              :error="!!formErrors.professionalId"
              :error-messages="formErrors.professionalId"
              required
            />

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

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="form.durationMinutes"
                  label="Duração (min)"
                  type="number"
                  min="5"
                  step="5"
                  variant="outlined"
                  density="compact"
                  :error="!!formErrors.durationMinutes"
                  :error-messages="formErrors.durationMinutes"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="form.price"
                  label="Valor (R$)"
                  type="number"
                  min="0"
                  step="0.01"
                  variant="outlined"
                  density="compact"
                  prefix="R$"
                  :error="!!formErrors.price"
                  :error-messages="formErrors.price"
                  required
                />
              </v-col>
            </v-row>

            <v-textarea
              v-model="form.description"
              label="Descrição"
              variant="outlined"
              density="compact"
              rows="2"
              class="mb-3"
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

    <!-- Delete Confirmation -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Excluir Serviço</v-card-title>
        <v-card-text>
          Deseja excluir "{{ deletingService?.name }}"? Se houver agendamentos vinculados, o serviço será desativado.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deletingService = null">Cancelar</v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            @click="handleDelete"
          >
            Excluir
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
import { useAuthStore } from "~/stores/auth";
import { api } from "~/utils/api";

interface Service {
  id: number;
  professionalId: number;
  name: string;
  durationMinutes: number;
  price: string;
  description: string | null;
  isActive: boolean;
}

interface Professional {
  id: number;
  name: string;
}

interface ServiceGroup {
  professionalId: number;
  professionalName: string;
  items: Service[];
}

const auth = useAuthStore();
const queryClient = useQueryClient();

const showModal = ref(false);
const editingService = ref<Service | null>(null);
const deletingService = ref<Service | null>(null);
const saving = ref(false);
const deleting = ref(false);
const saveError = ref("");
const showDeleteDialog = computed({
  get: () => deletingService.value !== null,
  set: (v) => { if (!v) deletingService.value = null; },
});

const form = reactive({
  professionalId: "",
  name: "",
  durationMinutes: 30,
  price: 0,
  description: "",
});

const formErrors = reactive({
  professionalId: "",
  name: "",
  durationMinutes: "",
  price: "",
});

const {
  data: servicesData,
  status,
  error,
} = useQuery<Service[]>({
  queryKey: ["services"],
  queryFn: () => api.get<Service[]>("/api/services"),
});

const { data: professionalsData } = useQuery<Professional[]>({
  queryKey: ["professionals"],
  queryFn: () => api.get<Professional[]>("/api/professionals"),
  enabled: computed(() => auth.user?.role === "OWNER"),
});

const groupedServices = computed<ServiceGroup[]>(() => {
  const svcs = servicesData.value ?? [];
  const profs = professionalsData.value ?? [];
  const map = new Map<number, ServiceGroup>();
  const names = new Map<number, string>();

  for (const p of profs) {
    names.set(p.id, p.name);
  }

  for (const svc of svcs) {
    if (!map.has(svc.professionalId)) {
      map.set(svc.professionalId, {
        professionalId: svc.professionalId,
        professionalName: names.get(svc.professionalId) ?? `Profissional #${svc.professionalId}`,
        items: [],
      });
    }
    map.get(svc.professionalId)?.items.push(svc);
  }

  return Array.from(map.values());
});

function resetForm() {
  form.professionalId = auth.user?.role === "OWNER" ? "" : String(auth.user?.id ?? "");
  form.name = "";
  form.durationMinutes = 30;
  form.price = 0;
  form.description = "";
  formErrors.professionalId = "";
  formErrors.name = "";
  formErrors.durationMinutes = "";
  formErrors.price = "";
  saveError.value = "";
}

function openCreateModal() {
  editingService.value = null;
  resetForm();
  showModal.value = true;
}

function openEditModal(svc: Service) {
  editingService.value = svc;
  form.professionalId = String(svc.professionalId);
  form.name = svc.name;
  form.durationMinutes = svc.durationMinutes;
  form.price = Number(svc.price);
  form.description = svc.description ?? "";
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingService.value = null;
}

async function handleSave() {
  saving.value = true;
  saveError.value = "";

  try {
    if (editingService.value) {
      await api.put(`/api/services/${editingService.value.id}`, {
        name: form.name,
        durationMinutes: form.durationMinutes,
        price: form.price,
        description: form.description || null,
      });
    } else {
      await api.post("/api/services", {
        professionalId: Number(form.professionalId),
        name: form.name,
        durationMinutes: form.durationMinutes,
        price: form.price,
        description: form.description || null,
      });
    }

    await queryClient.invalidateQueries({ queryKey: ["services"] });
    closeModal();
  } catch (err: unknown) {
    saveError.value = err instanceof Error ? err.message : "Erro ao salvar";
  } finally {
    saving.value = false;
  }
}

function confirmDelete(svc: Service) {
  deletingService.value = svc;
}

async function handleDelete() {
  if (!deletingService.value) return;
  deleting.value = true;

  try {
    await api.delete(`/api/services/${deletingService.value.id}`);
    await queryClient.invalidateQueries({ queryKey: ["services"] });
    deletingService.value = null;
  } catch (err: unknown) {
    console.error("Erro ao excluir:", err);
  } finally {
    deleting.value = false;
  }
}
</script>
