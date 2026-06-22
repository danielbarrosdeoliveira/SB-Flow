<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" sm="6" class="d-flex align-center">
        <span class="text-h6 font-weight-regular">Gerenciar Profissionais</span>
      </v-col>
      <v-col cols="12" sm="6" class="d-flex align-center justify-sm-end">
        <v-btn
          v-if="auth.user?.role === 'OWNER'"
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateModal"
        >
          Novo Profissional
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
      v-else-if="professionals.length === 0"
      type="info"
      variant="tonal"
      text="Nenhum profissional cadastrado."
    />

    <v-card v-else variant="outlined">
      <v-list lines="three">
        <v-list-item
          v-for="prof in professionals"
          :key="prof.id"
          :title="prof.name"
        >
          <template #prepend>
            <v-avatar color="secondary" variant="tonal">
              <span class="text-uppercase">{{ prof.name.charAt(0) }}</span>
            </v-avatar>
          </template>

          <template #subtitle>
            <span>{{ formatPhone(prof.phone) }} · {{ formatCpf(prof.cpf) }}</span>
            <br />
            <span class="text-caption">{{ prof.workHoursStart }} — {{ prof.workHoursEnd }}</span>
            <v-chip
              size="x-small"
              variant="flat"
              class="ml-1"
              :color="prof.role === 'OWNER' ? 'primary' : 'secondary'"
            >
              {{ prof.role === 'OWNER' ? 'Proprietária' : 'Parceira' }}
            </v-chip>
          </template>

          <template #append>
            <v-chip
              size="small"
              variant="tonal"
              :color="prof.isActive ? 'success' : 'error'"
              class="mr-2"
            >
              {{ prof.isActive ? 'Ativo' : 'Inativo' }}
            </v-chip>
            <v-btn
              v-if="auth.user?.role === 'OWNER'"
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              @click="openEditModal(prof)"
            />
            <v-btn
              v-if="auth.user?.role === 'OWNER' && prof.role !== 'OWNER'"
              :icon="prof.isActive ? 'mdi-account-cancel' : 'mdi-account-check'"
              variant="text"
              size="small"
              :color="prof.isActive ? 'error' : 'success'"
              @click="toggleActive(prof)"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="showModal" max-width="500">
      <v-card>
        <v-card-title>{{ editingProfessional ? 'Editar Profissional' : 'Novo Profissional' }}</v-card-title>
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

            <v-text-field
              v-model="formCpfMasked"
              label="CPF"
              placeholder="000.000.000-00"
              variant="outlined"
              density="compact"
              class="mb-3"
              :error="!!formErrors.cpf"
              :error-messages="formErrors.cpf"
              :disabled="!!editingProfessional && auth.user?.role !== 'OWNER'"
              @input="handleCpfInput"
            />

            <v-text-field
              v-model="form.password"
              label="Senha"
              type="password"
              variant="outlined"
              density="compact"
              class="mb-3"
              :error="!!formErrors.password"
              :error-messages="formErrors.password"
              :placeholder="editingProfessional ? 'Deixe em branco para manter' : ''"
              :required="!editingProfessional"
            />

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="form.workHoursStart"
                  type="time"
                  label="Início"
                  variant="outlined"
                  density="compact"
                  :error="!!formErrors.workHoursStart"
                  :error-messages="formErrors.workHoursStart"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.workHoursEnd"
                  type="time"
                  label="Fim"
                  variant="outlined"
                  density="compact"
                  :error="!!formErrors.workHoursEnd"
                  :error-messages="formErrors.workHoursEnd"
                />
              </v-col>
            </v-row>

            <v-select
              v-if="editingProfessional && auth.user?.role === 'OWNER'"
              v-model="form.role"
              :items="roleOptions"
              label="Função"
              variant="outlined"
              density="compact"
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

interface Professional {
  id: number;
  name: string;
  phone: string;
  cpf: string;
  role: string;
  isActive: boolean;
  workHoursStart: string;
  workHoursEnd: string;
}

const roleOptions = [
  { title: "Parceira", value: "PARTNER" },
  { title: "Proprietária", value: "OWNER" },
];

const auth = useAuthStore();
const queryClient = useQueryClient();

const showModal = ref(false);
const editingProfessional = ref<Professional | null>(null);
const saving = ref(false);
const saveError = ref("");

const form = reactive({
  name: "",
  phone: "",
  cpf: "",
  password: "",
  workHoursStart: "08:00",
  workHoursEnd: "20:00",
  role: "PARTNER",
});

const formPhoneMasked = ref("");
const formCpfMasked = ref("");

const formErrors = reactive({
  name: "",
  phone: "",
  cpf: "",
  password: "",
  workHoursStart: "",
  workHoursEnd: "",
});

const {
  data: professionalsData,
  status,
  error,
} = useQuery<Professional[]>({
  queryKey: ["professionals"],
  queryFn: () => api.get<Professional[]>("/api/professionals"),
});

const professionals = computed(() => professionalsData.value ?? []);

function resetForm() {
  form.name = "";
  form.phone = "";
  form.cpf = "";
  form.password = "";
  form.workHoursStart = "08:00";
  form.workHoursEnd = "20:00";
  form.role = "PARTNER";
  formPhoneMasked.value = "";
  formCpfMasked.value = "";
  formErrors.name = "";
  formErrors.phone = "";
  formErrors.cpf = "";
  formErrors.password = "";
  formErrors.workHoursStart = "";
  formErrors.workHoursEnd = "";
  saveError.value = "";
}

function openCreateModal() {
  editingProfessional.value = null;
  resetForm();
  showModal.value = true;
}

function openEditModal(prof: Professional) {
  editingProfessional.value = prof;
  form.name = prof.name;
  form.phone = prof.phone;
  form.cpf = prof.cpf;
  form.password = "";
  form.workHoursStart = prof.workHoursStart;
  form.workHoursEnd = prof.workHoursEnd;
  form.role = prof.role;
  formPhoneMasked.value = maskPhone(prof.phone);
  formCpfMasked.value = maskCpf(prof.cpf);
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingProfessional.value = null;
}

function handlePhoneInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.phone = unmaskPhone(target.value);
  formPhoneMasked.value = maskPhone(target.value);
}

function handleCpfInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const digits = target.value.replace(/\D/g, "").slice(0, 11);
  form.cpf = digits;
  formCpfMasked.value = maskCpf(target.value);
}

function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatPhone(phone: string): string {
  return maskPhone(phone);
}

function formatCpf(cpf: string): string {
  return maskCpf(cpf);
}

async function handleSave() {
  saving.value = true;
  saveError.value = "";

  try {
    const phone = normalizePhone(form.phone);

    if (editingProfessional.value) {
      const body: Record<string, unknown> = {
        name: form.name,
        phone,
        workHoursStart: form.workHoursStart,
        workHoursEnd: form.workHoursEnd,
      };

      if (form.password) body.password = form.password;

      if (auth.user?.role === "OWNER") {
        body.cpf = form.cpf;
        body.role = form.role;
      }

      await api.put(`/api/professionals/${editingProfessional.value.id}`, body);
    } else {
      await api.post("/api/professionals", {
        name: form.name,
        phone,
        cpf: form.cpf,
        password: form.password,
        workHoursStart: form.workHoursStart,
        workHoursEnd: form.workHoursEnd,
      });
    }

    await queryClient.invalidateQueries({ queryKey: ["professionals"] });
    closeModal();
  } catch (err: unknown) {
    saveError.value = err instanceof Error ? err.message : "Erro ao salvar";
  } finally {
    saving.value = false;
  }
}

async function toggleActive(prof: Professional) {
  try {
    await api.patch(`/api/professionals/${prof.id}/toggle-active`, {});
    await queryClient.invalidateQueries({ queryKey: ["professionals"] });
  } catch (err: unknown) {
    console.error("Erro ao alternar status:", err);
  }
}
</script>
