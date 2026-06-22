<template>
  <div class="min-h-screen bg-sb-white">
    <div class="max-w-lg mx-auto px-4 py-12">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="font-serif text-3xl text-sb-dark">Agende seu Horário</h1>
        <p class="text-sb-warm mt-2 text-sm">Escolha o serviço, profissional e o melhor horário para você</p>
      </div>

      <!-- Step indicator -->
      <div class="flex items-center justify-center gap-1 mb-10">
        <div v-for="(step, i) in steps" :key="i" class="flex items-center gap-1">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors"
            :class="stepState(i)"
          >
            <Icon v-if="currentStep > i" name="mdi:check" class="text-sm" />
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span
            class="text-xs hidden sm:inline transition-colors"
            :class="currentStep === i ? 'text-sb-primary font-semibold' : 'text-sb-warm/50'"
          >
            {{ step }}
          </span>
          <div v-if="i < steps.length - 1" class="w-6 sm:w-10 h-px mx-1 bg-sb-sand/50" />
        </div>
      </div>

      <!-- Step 0: Client info -->
      <div v-if="currentStep === 0" class="bg-white rounded-2xl shadow-sm border border-sb-sand/30 p-6 sm:p-8">
        <h2 class="font-serif text-xl text-sb-dark mb-6">Seus Dados</h2>
        <form @submit.prevent="goToStep(1)">
          <div class="mb-5">
            <label class="block text-sm font-medium text-sb-warm mb-1.5">Nome</label>
            <input
              v-model="form.name"
              class="w-full px-4 py-2.5 rounded-xl border border-sb-sand/50 bg-sb-white text-sb-dark placeholder:text-sb-warm/40 text-sm focus:outline-none focus:ring-2 focus:ring-sb-primary/40 focus:border-sb-primary transition-shadow"
              placeholder="Seu nome"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-sb-warm mb-1.5">Telefone</label>
            <input
              v-model="formPhoneMasked"
              type="tel"
              placeholder="(11) 98888-0015"
              class="w-full px-4 py-2.5 rounded-xl border border-sb-sand/50 bg-sb-white text-sb-dark placeholder:text-sb-warm/40 text-sm focus:outline-none focus:ring-2 focus:ring-sb-primary/40 focus:border-sb-primary transition-shadow"
              required
              @input="handlePhoneInput"
            />
            <p class="text-xs text-sb-warm/50 mt-1.5">Usado apenas para contato sobre o agendamento.</p>
          </div>
          <button
            type="submit"
            class="w-full py-3 bg-sb-primary text-white rounded-xl font-medium text-sm hover:bg-sb-primary-dark transition-colors"
          >
            Continuar
          </button>
        </form>
      </div>

      <!-- Step 1: Professional -->
      <div v-if="currentStep === 1" class="bg-white rounded-2xl shadow-sm border border-sb-sand/30 p-6 sm:p-8">
        <h2 class="font-serif text-xl text-sb-dark mb-6">Escolha a Profissional</h2>
        <div v-if="profStatus === 'pending'" class="flex items-center justify-center py-8 text-sb-warm/60 text-sm gap-2">
          <Icon name="svg-spinners:180-ring" class="text-lg text-sb-primary" />
          Carregando profissionais...
        </div>
        <div v-else class="space-y-3">
          <button
            v-for="prof in (professionals ?? [])"
            :key="prof.id"
            class="w-full text-left p-4 rounded-xl border transition-all"
            :class="form.professionalId === prof.id
              ? 'border-sb-primary bg-sb-primary/5 ring-1 ring-sb-primary/20'
              : 'border-sb-sand/30 hover:border-sb-primary/40 hover:bg-sb-primary/5'"
            @click="selectProfessional(prof)"
          >
            <div class="font-medium text-sb-dark">{{ prof.name }}</div>
          </button>
        </div>
      </div>

      <!-- Step 2: Service -->
      <div v-if="currentStep === 2" class="bg-white rounded-2xl shadow-sm border border-sb-sand/30 p-6 sm:p-8">
        <h2 class="font-serif text-xl text-sb-dark mb-6">Escolha o Serviço</h2>
        <div v-if="servicesStatus === 'pending'" class="flex items-center justify-center py-8 text-sb-warm/60 text-sm gap-2">
          <Icon name="svg-spinners:180-ring" class="text-lg text-sb-primary" />
          Carregando serviços...
        </div>
        <div v-else class="space-y-3">
          <button
            v-for="svc in (services ?? [])"
            :key="svc.id"
            class="w-full text-left p-4 rounded-xl border transition-all"
            :class="form.serviceId === svc.id
              ? 'border-sb-primary bg-sb-primary/5 ring-1 ring-sb-primary/20'
              : 'border-sb-sand/30 hover:border-sb-primary/40 hover:bg-sb-primary/5'"
            @click="selectService(svc)"
          >
            <div class="font-medium text-sb-dark">{{ svc.name }}</div>
            <div class="text-sm text-sb-warm/70 mt-0.5">
              {{ svc.durationMinutes }}min
              <span v-if="svc.price"> · R$ {{ svc.price }}</span>
            </div>
            <div v-if="svc.description" class="text-xs text-sb-warm/50 mt-1">{{ svc.description }}</div>
          </button>
        </div>
      </div>

      <!-- Step 3: Date & Time -->
      <div v-if="currentStep === 3" class="bg-white rounded-2xl shadow-sm border border-sb-sand/30 p-6 sm:p-8">
        <h2 class="font-serif text-xl text-sb-dark mb-6">Escolha a Data e Horário</h2>

        <div class="mb-5">
          <label class="block text-sm font-medium text-sb-warm mb-1.5">Data</label>
          <input
            v-model="form.date"
            type="date"
            class="w-full px-4 py-2.5 rounded-xl border border-sb-sand/50 bg-sb-white text-sb-dark text-sm focus:outline-none focus:ring-2 focus:ring-sb-primary/40 focus:border-sb-primary transition-shadow"
            :min="todayStr"
            @change="fetchSlots"
          />
        </div>

        <div v-if="slotsStatus === 'pending'" class="flex items-center justify-center py-8 text-sb-warm/60 text-sm gap-2">
          <Icon name="svg-spinners:180-ring" class="text-lg text-sb-primary" />
          Carregando horários...
        </div>
        <div v-else-if="!form.date" class="text-center py-8 text-sb-warm/40 text-sm">
          Selecione uma data acima
        </div>
        <div v-else-if="(slots ?? []).length === 0" class="text-center py-8">
          <Icon name="mdi:calendar-remove-outline" class="text-3xl text-sb-sand mx-auto mb-2" />
          <p class="text-sb-warm/60 text-sm">Nenhum horário disponível nesta data.</p>
        </div>
        <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <button
            v-for="slot in slots"
            :key="slot.time"
            :disabled="!slot.available"
            class="py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
            :class="
              !slot.available
                ? 'bg-sb-sand/20 text-sb-warm/30 cursor-not-allowed line-through'
                : form.time === slot.time
                  ? 'bg-sb-primary text-white shadow-sm'
                  : 'border border-sb-sand/40 text-sb-dark hover:border-sb-primary hover:text-sb-primary'
            "
            @click="form.time = slot.time"
          >
            {{ slot.time }}
          </button>
        </div>
      </div>

      <!-- Step 4: Confirm -->
      <div v-if="currentStep === 4" class="bg-white rounded-2xl shadow-sm border border-sb-sand/30 p-6 sm:p-8">
        <h2 class="font-serif text-xl text-sb-dark mb-6">Confirmar Agendamento</h2>

        <div class="space-y-4 text-sm">
          <div class="flex justify-between py-3 border-b border-sb-sand/20">
            <span class="text-sb-warm/60">Cliente</span>
            <span class="font-medium text-sb-dark">{{ form.name }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-sb-sand/20">
            <span class="text-sb-warm/60">Telefone</span>
            <span class="font-medium text-sb-dark">{{ formPhoneMasked }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-sb-sand/20">
            <span class="text-sb-warm/60">Profissional</span>
            <span class="font-medium text-sb-dark">{{ selectedProfName }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-sb-sand/20">
            <span class="text-sb-warm/60">Serviço</span>
            <span class="font-medium text-sb-dark">{{ selectedSvcName }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-sb-sand/20">
            <span class="text-sb-warm/60">Data</span>
            <span class="font-medium text-sb-dark">{{ formatDate(form.date) }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-sb-warm/60">Horário</span>
            <span class="font-medium text-sb-dark">{{ form.time }}</span>
          </div>
        </div>

        <p v-if="saveError" class="text-red-500 text-sm mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
          {{ saveError }}
        </p>

        <div v-if="success" class="mt-6 text-center py-6">
          <Icon name="mdi:check-circle-outline" class="text-4xl text-green-600 mx-auto mb-3" />
          <p class="font-semibold text-green-700 text-lg">Agendamento confirmado!</p>
          <p class="text-sm text-green-600/70 mt-1">Seu horário foi reservado com sucesso.</p>
        </div>

        <div v-else class="flex gap-3 mt-6">
          <button
            class="flex-1 py-3 rounded-xl border border-sb-sand/40 text-sb-warm text-sm font-medium hover:bg-sb-sand/10 transition-colors"
            @click="currentStep = 3"
          >
            Voltar
          </button>
          <button
            :disabled="saving"
            class="flex-1 py-3 bg-sb-primary text-white rounded-xl text-sm font-medium hover:bg-sb-primary-dark disabled:opacity-50 transition-colors"
            @click="handleConfirm"
          >
            <span v-if="saving" class="flex items-center justify-center gap-2">
              <Icon name="svg-spinners:180-ring" class="text-white" />
              Confirmando...
            </span>
            <span v-else>Confirmar</span>
          </button>
        </div>
      </div>

      <!-- Back navigation for steps 1-3 -->
      <div v-if="currentStep > 0 && currentStep < 4" class="mt-6 text-center">
        <button
          class="text-sm text-sb-warm/50 hover:text-sb-warm transition-colors"
          @click="currentStep--"
        >
          ← Voltar para etapa anterior
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"
import { api } from "../../utils/api"
import { maskPhone, normalizePhone, unmaskPhone } from "../../utils/phone"

interface Professional {
  id: number
  name: string
}

interface Service {
  id: number
  name: string
  durationMinutes: number
  price: string | null
  description: string | null
}

interface Slot {
  time: string
  available: boolean
}

const steps = ["Dados", "Profissional", "Serviço", "Data/Hora", "Confirmar"]
const currentStep = ref(0)
const saving = ref(false)
const saveError = ref("")
const success = ref(false)

const form = reactive({
  name: "",
  phone: "",
  professionalId: 0,
  serviceId: 0,
  date: "",
  time: "",
})

const formPhoneMasked = ref("")

const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
})

function stepState(i: number) {
  if (currentStep.value > i) return "bg-sb-primary text-white"
  if (currentStep.value === i) return "bg-sb-primary text-white ring-2 ring-sb-primary/30"
  return "bg-sb-sand/30 text-sb-warm/50"
}

function handlePhoneInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.phone = unmaskPhone(target.value)
  formPhoneMasked.value = maskPhone(target.value)
}

const { data: professionals, status: profStatus } = useQuery<Professional[]>({
  queryKey: ["booking-professionals"],
  queryFn: () => api.get<Professional[]>("/api/booking/professionals"),
})

const { data: services, status: servicesStatus } = useQuery<Service[]>({
  queryKey: ["booking-services", form.professionalId],
  queryFn: () => api.get<Service[]>(`/api/booking/professionals/${form.professionalId}/services`),
  enabled: computed(() => form.professionalId > 0),
})

const {
  data: slots,
  status: slotsStatus,
  refetch: refetchSlots,
} = useQuery<Slot[]>({
  queryKey: ["booking-slots", form.professionalId, form.date],
  queryFn: () =>
    api.get<Slot[]>(`/api/booking/professionals/${form.professionalId}/slots?date=${form.date}`),
  enabled: computed(() => form.professionalId > 0 && !!form.date),
})

const selectedProfName = computed(() => {
  if (!professionals.value) return ""
  const p = professionals.value.find((p: Professional) => p.id === form.professionalId)
  return p?.name ?? ""
})

const selectedSvcName = computed(() => {
  if (!services.value) return ""
  const s = services.value.find((s: Service) => s.id === form.serviceId)
  return s?.name ?? ""
})

function selectProfessional(prof: Professional) {
  form.professionalId = prof.id
  form.serviceId = 0
  form.date = ""
  form.time = ""
  currentStep.value = 2
}

function selectService(svc: Service) {
  form.serviceId = svc.id
  form.date = ""
  form.time = ""
  currentStep.value = 3
}

function fetchSlots() {
  form.time = ""
  if (form.date) refetchSlots()
}

function goToStep(step: number) {
  currentStep.value = step
}

async function handleConfirm() {
  saving.value = true
  saveError.value = ""

  try {
    const phone = normalizePhone(form.phone)
    const startTime = `${form.date}T${form.time}:00`

    await api.post("/api/booking/appointments", {
      professionalId: form.professionalId,
      serviceId: form.serviceId,
      startTime,
      clientName: form.name,
      clientPhone: phone,
    })

    success.value = true
  } catch (err: unknown) {
    saveError.value = err instanceof Error ? err.message : "Erro ao agendar"
  } finally {
    saving.value = false
  }
}

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00")
  return d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
</script>
