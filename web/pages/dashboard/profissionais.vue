<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Profissionais</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ auth.user?.name }} ({{ auth.user?.role }})</span>
          <button
            v-if="auth.user?.role === 'OWNER'"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            @click="openCreateModal"
          >
            + Novo Profissional
          </button>
          <NuxtLink to="/dashboard/agenda" class="text-sm text-gray-600 hover:text-gray-800">
            Agenda
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

      <div v-if="status === 'pending'" class="text-center py-8 text-gray-500">Carregando...</div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {{ error }}
      </div>

      <div v-else-if="professionals.length === 0" class="text-center py-8 text-gray-500">
        Nenhum profissional cadastrado.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="prof in professionals"
          :key="prof.id"
          class="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between"
        >
          <div class="flex-1">
            <div class="font-medium">{{ prof.name }}</div>
            <div class="text-sm text-gray-500">
              {{ formatPhone(prof.phone) }} · {{ formatCpf(prof.cpf) }}
            </div>
            <div class="text-sm text-gray-400">
              {{ prof.workHoursStart }} — {{ prof.workHoursEnd }}
              <span class="ml-2">· {{ prof.role === 'OWNER' ? 'Proprietária' : 'Parceira' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span
              class="text-xs px-2 py-1 rounded"
              :class="prof.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ prof.isActive ? 'Ativo' : 'Inativo' }}
            </span>
            <button
              v-if="auth.user?.role === 'OWNER'"
              class="text-sm text-blue-600 hover:text-blue-700"
              @click="openEditModal(prof)"
            >
              Editar
            </button>
            <button
              v-if="auth.user?.role === 'OWNER' && prof.role !== 'OWNER'"
              class="text-sm"
              :class="prof.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'"
              @click="toggleActive(prof)"
            >
              {{ prof.isActive ? 'Desativar' : 'Ativar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-lg font-bold mb-4">{{ editingProfessional ? 'Editar Profissional' : 'Novo Profissional' }}</h2>

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

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input
              v-model="formCpfMasked"
              placeholder="000.000.000-00"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': formErrors.cpf }"
              :disabled="!!editingProfessional && auth.user?.role !== 'OWNER'"
              @input="handleCpfInput"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': formErrors.password }"
              :placeholder="editingProfessional ? 'Deixe em branco para manter' : ''"
              :required="!editingProfessional"
            />
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Início</label>
              <input
                v-model="form.workHoursStart"
                type="time"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': formErrors.workHoursStart }"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fim</label>
              <input
                v-model="form.workHoursEnd"
                type="time"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': formErrors.workHoursEnd }"
              />
            </div>
          </div>

          <div v-if="editingProfessional && auth.user?.role === 'OWNER'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Função</label>
            <select
              v-model="form.role"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PARTNER">Parceira</option>
              <option value="OWNER">Proprietária</option>
            </select>
          </div>

          <p v-if="saveError" class="text-red-500 text-sm mb-4">{{ saveError }}</p>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              @click="closeModal"
            >
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

const auth = useAuthStore();
const router = useRouter();
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

const isEditing = computed(() => !!editingProfessional.value);

async function handleLogout() {
  await auth.logout();
  await router.push("/login");
}
</script>
