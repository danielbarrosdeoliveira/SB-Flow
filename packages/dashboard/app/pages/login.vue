<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2">
    <!-- Left: Image -->
    <div class="hidden lg:block relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/bg-login.jpg')">
      </div>
      <div class="absolute inset-0 bg-black/20"></div>
    </div>

    <!-- Right: Form -->
    <div class="flex items-center justify-center bg-warm-900 px-6 py-12">
      <div class="w-full max-w-sm">
        <div class="mb-8 text-center">
          <h1 class="font-serif text-3xl text-primary-light">SB-Flow</h1>
          <p class="mt-1 text-sm text-muted">Studio Blessed — Dashboard</p>
        </div>

        <div v-if="loginError" class="mb-5 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {{ loginError }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="mb-1.5 block text-sm text-muted">Telefone</label>
            <input v-model="phoneMasked" @input="handlePhoneInput($event)" placeholder="(11) 98888-0015"
              class="w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-foreground placeholder-warm-500 outline-none transition focus:border-primary" />
            <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm text-muted">Senha</label>
            <input v-model="form.password" type="password" placeholder="Sua senha"
              class="w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-foreground placeholder-warm-500 outline-none transition focus:border-primary" />
            <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
            {{ loading ? "Entrando..." : "Entrar" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useAuthStore } from "~/features/auth/stores/auth";
import { maskPhone, normalizePhone, unmaskPhone } from "~/utils/phone";

const auth = useAuthStore();

const form = reactive({ phone: "", password: "" });
const phoneMasked = ref("");
const loading = ref(false);
const loginError = ref("");
const errors = reactive({ phone: "", password: "" });

const schema = z.object({
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

function handlePhoneInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  form.phone = unmaskPhone(val);
  phoneMasked.value = maskPhone(val);
}

async function handleLogin() {
  errors.phone = "";
  errors.password = "";
  loginError.value = "";

  const result = schema.safeParse(form);
  if (!result.success) {
    const field = result.error.flatten().fieldErrors;
    if (field.phone) errors.phone = field.phone[0] ?? "";
    if (field.password) errors.password = field.password[0] ?? "";
    return;
  }

  loading.value = true;
  try {
    const normalizedPhone = normalizePhone(form.phone);
    await auth.login(normalizedPhone, form.password);
    return navigateTo("/dashboard/");
  } catch (err: unknown) {
    loginError.value = err instanceof Error ? err.message : "Credenciais inválidas";
  } finally {
    loading.value = false;
  }
}
</script>