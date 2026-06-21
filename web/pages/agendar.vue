<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-lg mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-center mb-8">Agendar Horário</h1>

      <!-- Step indicator -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="flex items-center gap-2"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="currentStep > i ? 'bg-blue-600 text-white' : currentStep === i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'"
          >
            {{ currentStep > i ? '✓' : i + 1 }}
          </div>
          <span class="text-sm hidden sm:inline" :class="currentStep === i ? 'text-blue-600 font-medium' : 'text-gray-500'">{{ step }}</span>
          <div v-if="i < steps.length - 1" class="w-8 h-px bg-gray-300 mx-1" />
        </div>
      </div>

      <!-- Step 0: Client Info -->
      <div v-if="currentStep === 0" class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-lg font-semibold mb-4">Seus Dados</h2>
        <form @submit.prevent="goToStep(1)">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              v-model="form.name"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              v-model="formPhoneMasked"
              type="tel"
              placeholder="(11) 98888-0015"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              @input="handlePhoneInput"
            />
            <p class="text-xs text-gray-400 mt-1">Se o número estiver errado, a proprietária pode corrigir depois.</p>
          </div>
          <button
            type="submit"
            class="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Continuar
          </button>
        </form>
      </div>

      <!-- Step 1: Select Professional -->
      <div v-if="currentStep === 1" class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-lg font-semibold mb-4">Escolha a Profissional</h2>
        <div v-if="profStatus === 'pending'" class="text-center py-4 text-gray-500">Carregando...</div>
        <div v-else class="space-y-3">
          <button
            v-for="prof in (professionals ?? [])"
            :key="prof.id"
            class="w-full text-left p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            :class="form.professionalId === prof.id ? 'border-blue-500 bg-blue-50' : ''"
            @click="selectProfessional(prof)"
          >
            <div class="font-medium">{{ prof.name }}</div>
          </button>
        </div>
      </div>

      <!-- Step 2: Select Service -->
      <div v-if="currentStep === 2" class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-lg font-semibold mb-4">Escolha o Serviço</h2>
        <div v-if="servicesStatus === 'pending'" class="text-center py-4 text-gray-500">Carregando...</div>
        <div v-else class="space-y-3">
          <button
            v-for="svc in (services ?? [])"
            :key="svc.id"
            class="w-full text-left p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            :class="form.serviceId === svc.id ? 'border-blue-500 bg-blue-50' : ''"
            @click="selectService(svc)"
          >
            <div class="font-medium">{{ svc.name }}</div>
            <div class="text-sm text-gray-500">{{ svc.durationMinutes }}min · R$ {{ svc.price }}</div>
            <div v-if="svc.description" class="text-xs text-gray-400 mt-0.5">{{ svc.description }}</div>
          </button>
        </div>
      </div>

      <!-- Step 3: Select Date & Time -->
      <div v-if="currentStep === 3" class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-lg font-semibold mb-4">Escolha a Data e Horário</h2>
        <div class="mb-4">
          <input
            v-model="form.date"
            type="date"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :min="todayStr"
            @change="fetchSlots"
          />
        </div>
        <div v-if="slotsStatus === 'pending'" class="text-center py-4 text-gray-500">Carregando horários...</div>
        <div v-else-if="!form.date" class="text-center py-4 text-gray-400">Selecione uma data</div>
        <div v-else-if="(slots ?? []).length === 0" class="text-center py-4 text-gray-500">
          Nenhum horário disponível nesta data.
        </div>
        <div v-else class="grid grid-cols-3 gap-2">
          <button
            v-for="slot in slots"
            :key="slot.time"
            :disabled="!slot.available"
            class="py-2 px-3 border rounded-lg text-sm font-medium transition-colors"
            :class="
              !slot.available
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : form.time === slot.time
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'hover:border-blue-500 hover:bg-blue-50'
            "
            @click="form.time = slot.time"
          >
            {{ slot.time }}
          </button>
        </div>
      </div>

      <!-- Step 4: Confirm -->
      <div v-if="currentStep === 4" class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-lg font-semibold mb-4">Confirmar Agendamento</h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between py-2 border-b">
            <span class="text-gray-500">Cliente</span>
            <span class="font-medium">{{ form.name }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-gray-500">Telefone</span>
            <span class="font-medium">{{ formPhoneMasked }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-gray-500">Profissional</span>
            <span class="font-medium">{{ selectedProfName }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-gray-500">Serviço</span>
            <span class="font-medium">{{ selectedSvcName }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-gray-500">Data</span>
            <span class="font-medium">{{ formatDate(form.date) }}</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-gray-500">Horário</span>
            <span class="font-medium">{{ form.time }}</span>
          </div>
        </div>

        <p v-if="saveError" class="text-red-500 text-sm mt-4">{{ saveError }}</p>

        <div v-if="success" class="mt-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center">
          <p class="font-medium">Agendamento confirmado!</p>
          <p class="text-sm mt-1">Você pode ver seus agendamentos na página "Meus Agendamentos".</p>
        </div>

        <div v-else class="flex gap-3 mt-6">
          <button
            class="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            @click="currentStep = 3"
          >
            Voltar
          </button>
          <button
            :disabled="saving"
            class="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            @click="handleConfirm"
          >
            {{ saving ? 'Confirmando...' : 'Confirmar' }}
          </button>
        </div>
      </div>

      <!-- Back button for steps 1-3 -->
      <div v-if="currentStep > 0 && currentStep < 4" class="mt-4 text-center">
        <button class="text-sm text-gray-500 hover:text-gray-700" @click="currentStep--">
          ← Voltar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { api } from "../utils/api";
import { maskPhone, normalizePhone, unmaskPhone } from "../utils/phone";

interface Professional {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  durationMinutes: number;
  price: string;
  description: string | null;
}

interface Slot {
  time: string;
  available: boolean;
}

const steps = ["Dados", "Profissional", "Serviço", "Data/Hora", "Confirmar"];
const currentStep = ref(0);
const saving = ref(false);
const saveError = ref("");
const success = ref(false);

const form = reactive({
  name: "",
  phone: "",
  professionalId: 0,
  serviceId: 0,
  date: "",
  time: "",
});

const formPhoneMasked = ref("");

const todayStr = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
});

function handlePhoneInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.phone = unmaskPhone(target.value);
  formPhoneMasked.value = maskPhone(target.value);
}

// Professionals
const {
  data: professionals,
  status: profStatus,
} = useQuery<Professional[]>({
  queryKey: ["booking-professionals"],
  queryFn: () => api.get<Professional[]>("/api/booking/professionals"),
});

// Services for selected professional
const {
  data: services,
  status: servicesStatus,
} = useQuery<Service[]>({
  queryKey: ["booking-services", form.professionalId],
  queryFn: () => api.get<Service[]>(`/api/booking/professionals/${form.professionalId}/services`),
  enabled: computed(() => form.professionalId > 0),
});

// Available slots
const {
  data: slots,
  status: slotsStatus,
  refetch: refetchSlots,
} = useQuery<Slot[]>({
  queryKey: ["booking-slots", form.professionalId, form.date],
  queryFn: () => api.get<Slot[]>(`/api/booking/professionals/${form.professionalId}/slots?date=${form.date}`),
  enabled: computed(() => form.professionalId > 0 && !!form.date),
});

const selectedProfName = computed(() => {
  if (!professionals.value) return "";
  const p = professionals.value.find((p: Professional) => p.id === form.professionalId);
  return p?.name ?? "";
});

const selectedSvcName = computed(() => {
  if (!services.value) return "";
  const s = services.value.find((s: Service) => s.id === form.serviceId);
  return s?.name ?? "";
});

function selectProfessional(prof: Professional) {
  form.professionalId = prof.id;
  form.serviceId = 0;
  form.date = "";
  form.time = "";
  currentStep.value = 2;
}

function selectService(svc: Service) {
  form.serviceId = svc.id;
  form.date = "";
  form.time = "";
  currentStep.value = 3;
}

function fetchSlots() {
  form.time = "";
  if (form.date) refetchSlots();
}

function goToStep(step: number) {
  currentStep.value = step;
}

async function handleConfirm() {
  saving.value = true;
  saveError.value = "";

  try {
    const phone = normalizePhone(form.phone);
    const startTime = `${form.date}T${form.time}:00`;

    await api.post("/api/booking/appointments", {
      professionalId: form.professionalId,
      serviceId: form.serviceId,
      startTime,
      clientName: form.name,
      clientPhone: phone,
    });

    success.value = true;
  } catch (err: unknown) {
    saveError.value = err instanceof Error ? err.message : "Erro ao agendar";
  } finally {
    saving.value = false;
  }
}

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
</script>
