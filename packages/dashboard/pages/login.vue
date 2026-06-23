<template>
  <div class="flex min-h-screen items-center justify-center bg-[var(--color-foreground)]">
    <div class="w-full max-w-sm rounded-xl border border-[var(--color-warm)]/30 p-8">
      <div class="mb-8 text-center">
        <h1 class="font-serif text-3xl text-[var(--color-primary-light)]">SB-Flow</h1>
        <p class="mt-1 text-sm text-[var(--color-sand)]/70">Studio Blessed — Dashboard</p>
      </div>

      <div
        v-if="loginError"
        class="mb-5 rounded-lg bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]"
      >
        {{ loginError }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="mb-1.5 block text-sm text-[var(--color-sand)]">Telefone</label>
          <input
            v-model="phoneMasked"
            @input="handlePhoneInput($event)"
            placeholder="(11) 98888-0015"
            class="w-full rounded-lg border border-[var(--color-warm)]/30 bg-transparent px-4 py-2.5 text-[var(--color-bg)] placeholder-[var(--color-warm)]/50 outline-none transition focus:border-[var(--color-primary)]"
          />
          <p v-if="errors.phone" class="mt-1 text-xs text-[var(--color-error)]">{{ errors.phone }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm text-[var(--color-sand)]">Senha</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Sua senha"
            class="w-full rounded-lg border border-[var(--color-warm)]/30 bg-transparent px-4 py-2.5 text-[var(--color-bg)] placeholder-[var(--color-warm)]/50 outline-none transition focus:border-[var(--color-primary)]"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-[var(--color-error)]">{{ errors.password }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full cursor-pointer rounded-lg bg-[var(--color-primary)] px-4 py-2.5 font-semibold text-[var(--color-foreground)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod"
import { useAuthStore } from "~/stores/auth"
import { maskPhone, normalizePhone, unmaskPhone } from "~/utils/phone"

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ phone: "", password: "" })
const phoneMasked = ref("")
const loading = ref(false)
const loginError = ref("")
const errors = reactive({ phone: "", password: "" })

const schema = z.object({
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(1, "Senha obrigatória"),
})

function handlePhoneInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  form.phone = unmaskPhone(val)
  phoneMasked.value = maskPhone(val)
}

async function handleLogin() {
  errors.phone = ""
  errors.password = ""
  loginError.value = ""

  const result = schema.safeParse(form)
  if (!result.success) {
    const field = result.error.flatten().fieldErrors
    if (field.phone) errors.phone = field.phone[0]
    if (field.password) errors.password = field.password[0]
    return
  }

  loading.value = true
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
