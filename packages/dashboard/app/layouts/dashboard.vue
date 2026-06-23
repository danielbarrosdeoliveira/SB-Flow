<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const userName = computed(() => auth.user?.name ?? "Usuário");

const pageTitles: Record<string, string> = {
  "/dashboard/": "Dashboard",
  "/dashboard/agenda": "Agendamentos",
  "/dashboard/clientes": "Clientes",
  "/dashboard/profissionais": "Profissionais",
  "/dashboard/servicos": "Serviços",
};

const pageTitle = computed(() => pageTitles[route.path] ?? "Dashboard");

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    to: "/dashboard/",
  },
  {
    label: "Clientes",
    icon: "i-lucide-users",
    to: "/dashboard/clientes",
  },
  {
    label: "Profissionais",
    icon: "i-lucide-briefcase",
    to: "/dashboard/profissionais",
  },
  {
    label: "Agendamentos",
    icon: "i-lucide-calendar",
    to: "/dashboard/agenda",
  },
  {
    label: "Serviços",
    icon: "i-lucide-wrench",
    to: "/dashboard/servicos",
  },
]);

async function handleLogout() {
  await auth.logout();
  router.push("/login");
}
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2 px-2">
          <div class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
            <span class="text-sm font-bold text-white">SB</span>
          </div>
          <span v-show="!collapsed" class="font-serif text-lg text-orange-300">Flow</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu orientation="vertical" :collapsed="collapsed" :items="navItems" :model-value="route.path"
          color="primary" variant="link" class="flex-1 py-2 px-2" />
      </template>

      <template #footer="{ collapsed }">
        <div class="p-2 border-t border-warm-200">
          <UButton icon="i-lucide-log-out" color="neutral" variant="ghost" :label="collapsed ? undefined : 'Sair'"
            :square="collapsed" block @click="handleLogout" />
        </div>
      </template>
    </UDashboardSidebar>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-warm-200 shrink-0 bg-warm-50">
        <div class="flex items-center gap-2">
          <UDashboardSidebarCollapse />
          <h1 class="text-lg font-semibold truncate text-warm-950">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-2">
          <UButton icon="i-lucide-bell" color="neutral" variant="ghost" :square="true" />
          <span class="text-sm hidden sm:inline text-warm-600">{{ userName }}</span>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto">
        <div class="p-4 lg:p-6">
          <slot />
        </div>
      </main>
    </div>
  </UDashboardGroup>
</template>