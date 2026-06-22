<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      rail-width="72"
      permanent
    >
      <template #prepend>
        <v-list-item
          prepend-avatar="https://ui-avatars.com/api/?name=SB&background=B8860B&color=fff&size=40"
          title="Studio Blessed"
          subtitle="Dashboard"
          nav
        >
          <template #append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              size="small"
              @click.stop="rail = !rail"
            />
          </template>
        </v-list-item>
      </template>

      <v-divider />

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-calendar"
          title="Agenda"
          :to="'/dashboard/agenda'"
          exact
          color="primary"
        />
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Clientes"
          :to="'/dashboard/clientes'"
          exact
          color="primary"
        />
        <v-list-item
          prepend-icon="mdi-card-account-details"
          title="Profissionais"
          :to="'/dashboard/profissionais'"
          exact
          color="primary"
        />
        <v-list-item
          prepend-icon="mdi-content-cut"
          title="Serviços"
          :to="'/dashboard/servicos'"
          exact
          color="primary"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar flat>
      <v-app-bar-title>
        {{ pageTitle }}
      </v-app-bar-title>

      <v-spacer />

      <v-chip variant="outlined" size="small" class="mr-2">
        {{ auth.user?.name }}
        <v-chip
          variant="flat"
          size="x-small"
          class="ml-1"
          :color="auth.user?.role === 'OWNER' ? 'primary' : 'secondary'"
        >
          {{ auth.user?.role === 'OWNER' ? 'Proprietária' : 'Parceira' }}
        </v-chip>
      </v-chip>

      <v-btn icon="mdi-logout" variant="text" @click="handleLogout" />
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const drawer = ref(true);
const rail = ref(true);
const route = useRoute();

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    agenda: "Agenda",
    clientes: "Clientes",
    profissionais: "Profissionais",
    servicos: "Serviços",
  };
  return map[route.name as string] ?? "Dashboard";
});

async function handleLogout() {
  await auth.logout();
  await router.push("/login");
}
</script>
