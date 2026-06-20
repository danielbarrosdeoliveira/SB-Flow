import { defineStore } from "pinia";
import { api } from "../utils/api";

interface User {
  id: number;
  name: string;
  phone: string;
  role: string;
}

interface LoginResponse {
  user: User;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => user.value !== null);
  const role = computed(() => user.value?.role ?? null);

  async function login(phone: string, password: string) {
    const data = await api.post<LoginResponse>("/api/auth/login", { phone, password });
    user.value = data.user;
  }

  async function refreshToken() {
    try {
      const data = await api.post<{ ok: boolean }>("/api/auth/refresh");
      return data.ok;
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
    }
  }

  return { user, isAuthenticated, role, login, refreshToken, logout };
});
