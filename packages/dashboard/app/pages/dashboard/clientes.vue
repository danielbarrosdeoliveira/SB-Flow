<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { refDebounced } from "@vueuse/core";
import authMiddleware from "~/features/auth/middleware/auth";
import {
  useClients,
  type Client,
} from "~/features/clients/composables/use-clients";

const ClientFormModal = defineAsyncComponent(() => import("~/components/ClientFormModal.vue"));

definePageMeta({
  layout: "dashboard",
  middleware: authMiddleware,
});

const toast = useToast();
const overlay = useOverlay();

const search = ref("");
const debouncedSearch = refDebounced(search, 300);
const currentPage = ref(1);
const pageSize = 8;

const { data: clients, isLoading, error, refetch } = useClients(debouncedSearch);

const hasFilters = computed(() => !!search.value);

const paginatedClients = computed(() => {
  const list = clients.value ?? [];
  const start = (currentPage.value - 1) * pageSize;
  return list.slice(start, start + pageSize);
});

watch(debouncedSearch, () => {
  currentPage.value = 1;
});

const formModal = overlay.create(ClientFormModal);

function openCreate() {
  formModal.open({ client: null });
}

function openEdit(client: Client) {
  formModal.open({ client });
}
</script>

<template>
  <div class="space-y-6">
    <ClientsHeader v-model:search="search" @create="openCreate" />

    <ClientsList
      v-model:current-page="currentPage"
      :clients="paginatedClients"
      :is-loading="isLoading"
      :error="error"
      :total-items="(clients ?? []).length"
      :page-size="pageSize"
      :has-filters="hasFilters"
      @edit="openEdit"
      @refetch="refetch"
    />
  </div>
</template>
