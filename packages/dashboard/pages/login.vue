<template>
  <div class="flex min-h-screen items-center justify-center bg-sb-dark">
    <UCard class="w-full max-w-sm">
      <div class="mb-6 text-center">
        <h1 class="text-xl font-semibold text-sb-dark">SB-Flow</h1>
        <p class="mt-1 text-sm text-sb-warm">Studio Blessed — Dashboard</p>
      </div>

      <UForm :schema="schema" :state="form" @submit="handleLogin">
        <UFormField label="Telefone" name="phone" class="mb-4">
          <UInput
            v-model="phoneMasked"
            placeholder="(11) 98888-0015"
            @update:model-value="handlePhoneInput"
          />
        </UFormField>

        <UFormField label="Senha" name="password" class="mb-4">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Sua senha"
          />
        </UFormField>

        <UAlert
          v-if="loginError"
          color="error"
          variant="subtle"
          class="mb-4"
          :description="loginError"
        />

        <UButton
          type="submit"
          color="primary"
          block
          :loading="loading"
        >
          {{ loading ? "Entrando..." : "Entrar" }}
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod"
import { useAuthStore } from "~/stores/auth"
import { maskPhone, normalizePhone, unmaskPhone } from "~/utils/phone"

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  phone: "",
  password: "",
})
const phoneMasked = ref("")
const loading = ref(false)
const loginError = ref("")

const schema = z.object({
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(1, "Senha obrigatória"),
})

function handlePhoneInput(val: string) {
  form.phone = unmaskPhone(val)
  phoneMasked.value = maskPhone(val)
}

async function handleLogin() {
  loading.value = true
  loginError.value = ""

  try {
    const normalizedPhone = normalizePhone(form.phone)
    await auth.login(normalizedPhone, form.password)
    await router.push("/dashboard/agenda")
  } catch (err: unknown) {
    loginError.value = err instanceof Error ? err.message : "Credenciais inválidas"
  } finally {
    loading.value = false
  }
}
</script>
