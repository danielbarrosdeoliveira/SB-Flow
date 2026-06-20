<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-sm mx-4">
      <div class="bg-white rounded-xl shadow-sm border p-8">
        <h1 class="text-2xl font-bold text-center mb-6">SB-Flow</h1>

        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              v-model="phoneMasked"
              type="tel"
              placeholder="(11) 98888-0015"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.phone }"
              @input="handlePhoneInput"
            />
            <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Sua senha"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
          </div>

          <p v-if="loginError" class="text-red-500 text-sm text-center mb-4">{{ loginError }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? "Entrando..." : "Entrar" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import { maskPhone, unmaskPhone, normalizePhone } from "../utils/phone";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  phone: "",
  password: "",
});
const phoneMasked = ref("");
const loading = ref(false);
const loginError = ref("");

const errors = reactive({
  phone: "",
  password: "",
});

const loginSchema = z.object({
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

function handlePhoneInput(e: Event) {
  const target = e.target as HTMLInputElement;
  form.phone = unmaskPhone(target.value);
  phoneMasked.value = maskPhone(target.value);
  errors.phone = "";
}

async function handleLogin() {
  const result = loginSchema.safeParse({
    phone: form.phone,
    password: form.password,
  });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    errors.phone = fieldErrors.phone?.[0] ?? "";
    errors.password = fieldErrors.password?.[0] ?? "";
    return;
  }

  loading.value = true;
  loginError.value = "";

  try {
    const normalizedPhone = normalizePhone(result.data.phone);
    await auth.login(normalizedPhone, result.data.password);
    await router.push("/dashboard/agenda");
  } catch (err: unknown) {
    loginError.value = err instanceof Error ? err.message : "Credenciais inválidas";
  } finally {
    loading.value = false;
  }
}
</script>
