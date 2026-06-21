<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Serviços</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ auth.user?.name }} ({{ auth.user?.role }})</span>
          <button
            v-if="auth.user?.role === 'OWNER'"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            @click="openCreateModal"
          >
            + Novo Serviço
          </button>
          <NuxtLink to="/dashboard/agenda" class="text-sm text-gray-600 hover:text-gray-800">
            Agenda
          </NuxtLink>
          <button class="text-sm text-red-600 hover:text-red-700" @click="handleLogout">Sair</button>
        </div>
      </div>

      <div v-if="status === 'pending'" class="text-center py-8 text-gray-500">Carregando...</div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {{ error }}
      </div>

      <div v-else-if="(servicesData ?? []).length === 0" class="text-center py-8 text-gray-500">
        Nenhum serviço cadastrado.
      </div>

      <div v-else class="space-y-4">
        <div v-for="group in groupedServices" :key="group.professionalId" class="bg-white rounded-lg shadow-sm border">
          <div class="px-6 py-3 border-b bg-gray-50 font-medium text-sm text-gray-700">
            {{ group.professionalName }}
          </div>
          <div class="divide-y">
            <div v-for="svc in group.items" :key="svc.id" class="px-6 py-4 flex items-center justify-between">
              <div class="flex-1">
                <div class="font-medium">{{ svc.name }}</div>
                <div class="text-sm text-gray-500">
                  {{ svc.durationMinutes }}min · R$ {{ svc.price }}
                </div>
                <div v-if="svc.description" class="text-xs text-gray-400 mt-0.5">{{ svc.description }}</div>
              </div>
              <div v-if="!svc.isActive" class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded mr-3">
                Inativo
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="text-sm text-blue-600 hover:text-blue-700"
                  @click="openEditModal(svc)"
                >
                  Editar
                </button>
                <button
                  class="text-sm text-red-600 hover:text-red-700"
                  @click="confirmDelete(svc)"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-lg font-bold mb-4">{{ editingService ? 'Editar Serviço' : 'Novo Serviço' }}</h2>

        <form @submit.prevent="handleSave">
          <div v-if="auth.user?.role === 'OWNER'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
            <select
              v-model="form.professionalId"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': formErrors.professionalId }"
              required
            >
              <option value="" disabled>Selecione...</option>
              <option v-for="p in (professionalsData ?? [])" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              v-model="form.name"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': formErrors.name }"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duração (min)</label>
              <input
                v-model.number="form.durationMinutes"
                type="number"
                min="5"
                step="5"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': formErrors.durationMinutes }"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': formErrors.price }"
                required
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

    <!-- Delete Confirmation -->
    <div v-if="deletingService" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="deletingService = null">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
        <h3 class="text-lg font-bold mb-2">Excluir Serviço</h3>
        <p class="text-gray-600 text-sm mb-6">
          Deseja excluir "{{ deletingService.name }}"? Se houver agendamentos vinculados, o serviço será desativado.
        </p>
        <div class="flex justify-end gap-3">
          <button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800" @click="deletingService = null">
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
            :disabled="deleting"
            @click="handleDelete"
          >
            {{ deleting ? 'Excluindo...' : 'Excluir' }}
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

definePageMeta({
  middleware: "auth" as any,
});

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
const router = useRouter();
const queryClient = useQueryClient();

const showModal = ref(false);
const editingService = ref<Service | null>(null);
const deletingService = ref<Service | null>(null);
const saving = ref(false);
const deleting = ref(false);
const saveError = ref("");

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

async function handleLogout() {
  await auth.logout();
  await router.push("/login");
}
</script>
