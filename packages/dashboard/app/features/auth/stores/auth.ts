import { defineStore } from "pinia";
import { api } from "~/shared/utils/api";

interface User {
  id: number;
  name: string;
  phone: string;
  role: string;
}

interface AuthResponse {
  user: User;
  ok?: boolean;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => user.value !== null);
  const role = computed(() => user.value?.role ?? null);
  const userName = computed(() => user.value?.name ?? "Usuário");

  async function login(phone: string, password: string) {
    const data = await api.post<AuthResponse>("/api/auth/login", {
      phone,
      password,
    });
    user.value = data.user;
  }

  async function refreshToken() {
    try {
      const data = await api.post<AuthResponse>("/api/auth/refresh");
      user.value = data.user;
      return true;
    } catch {
      user.value = null;
      return false;
    }
  }

  async function logout() {
    try {
      await api.post("/api/auth/logout");
    } finally {
      user.value = null;
      const { useQueryClient } = await import("@tanstack/vue-query");
      const queryClient = useQueryClient();
      queryClient.clear();
    }
  }

  return { user, isAuthenticated, role, userName, login, refreshToken, logout };
});