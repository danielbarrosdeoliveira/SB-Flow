<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-grey-lighten-3">
      <v-card class="mx-4" width="400">
        <v-card-title class="text-center pt-6">
          <span class="text-h5 font-weight-bold">SB-Flow</span>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="phoneMasked"
              label="Telefone"
              placeholder="(11) 98888-0015"
              :error-messages="errors.phone"
              variant="outlined"
              class="mb-3"
              @update:model-value="handlePhoneInput"
            />

            <v-text-field
              v-model="form.password"
              label="Senha"
              type="password"
              placeholder="Sua senha"
              :error-messages="errors.password"
              variant="outlined"
              class="mb-3"
            />

            <v-alert
              v-if="loginError"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              {{ loginError }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              block
              :loading="loading"
              size="large"
            >
              {{ loading ? "Entrando..." : "Entrar" }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
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

const errors = reactive({
  phone: "",
  password: "",
})

const loginSchema = z.object({
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(1, "Senha obrigatória"),
})

function handlePhoneInput(val: string) {
  form.phone = unmaskPhone(val)
  phoneMasked.value = maskPhone(val)
  errors.phone = ""
}

async function handleLogin() {
  const result = loginSchema.safeParse({
    phone: form.phone,
    password: form.password,
  })

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    errors.phone = fieldErrors.phone?.[0] ?? ""
    errors.password = fieldErrors.password?.[0] ?? ""
    return
  }

  loading.value = true
  loginError.value = ""

  try {
    const normalizedPhone = normalizePhone(result.data.phone)
    await auth.login(normalizedPhone, result.data.password)
    await router.push("/dashboard/agenda")
  } catch (err: unknown) {
    loginError.value = err instanceof Error ? err.message : "Credenciais inválidas"
  } finally {
    loading.value = false
  }
}
</script>
