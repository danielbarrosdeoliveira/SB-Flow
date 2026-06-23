<template>
  <div class="w-screen h-screen overflow-hidden flex" style="background-color: var(--color-bg)">
    <USidebar
      v-model:open="layoutStore.isSidebarOpen"
      collapsible="icon"
      :ui="{
        root: 'border-r border-[var(--color-warm)]/20',
        container: 'bg-[var(--color-bg)]',
      }"
    >
      <div class="flex flex-col h-full">
        <div class="h-16 flex items-center gap-2 px-4 border-b border-[var(--color-warm)]/20">
          <div class="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shrink-0">
            <span class="text-sm font-bold text-white">SB</span>
          </div>
          <span v-show="layoutStore.isSidebarOpen" class="font-serif text-lg" style="color: var(--color-primary-light)">Flow</span>
        </div>

        <UNavigationMenu
          orientation="vertical"
          :collapsed="!layoutStore.isSidebarOpen"
          :items="navItems"
          :model-value="route.path"
          color="primary"
          variant="subtle"
          class="flex-1 py-2 px-2"
        />

        <div class="p-2 border-t border-[var(--color-warm)]/20">
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            :label="layoutStore.isSidebarOpen ? 'Sair' : ''"
            :square="!layoutStore.isSidebarOpen"
            block
            @click="handleLogout"
          />
        </div>
      </div>
    </USidebar>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-[var(--color-warm)]/20 shrink-0" style="background-color: var(--color-bg)">
        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-panel-left"
            color="neutral"
            variant="ghost"
            :square="true"
            @click="layoutStore.toggleSidebar()"
          />
          <h1 class="text-lg font-semibold truncate" style="color: var(--color-foreground)">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-2">
          <UButton icon="i-lucide-bell" color="neutral" variant="ghost" :square="true" />
          <span class="text-sm hidden sm:inline" style="color: var(--color-warm)">{{ userName }}</span>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto">
        <div class="p-4 lg:p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const layoutStore = useLayoutStore();

const userName = computed(() => auth.user?.name ?? "Usuário");

const pageTitles: Record<string, string> = {
  "/dashboard/": "Dashboard",
  "/dashboard/agenda": "Agendamentos",
  "/dashboard/clientes": "Clientes",
  "/dashboard/profissionais": "Profissionais",
  "/dashboard/servicos": "Serviços",
};

const pageTitle = computed(() => pageTitles[route.path] ?? "Dashboard");

const navItems = [
  { label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/dashboard/", value: "/dashboard/" },
  { label: "Clientes", icon: "i-lucide-users", to: "/dashboard/clientes", value: "/dashboard/clientes" },
  { label: "Profissionais", icon: "i-lucide-briefcase", to: "/dashboard/profissionais", value: "/dashboard/profissionais" },
  { label: "Agendamentos", icon: "i-lucide-calendar", to: "/dashboard/agenda", value: "/dashboard/agenda" },
  { label: "Serviços", icon: "i-lucide-wrench", to: "/dashboard/servicos", value: "/dashboard/servicos" },
];

async function handleLogout() {
  await auth.logout();
  router.push("/login");
}
</script>
