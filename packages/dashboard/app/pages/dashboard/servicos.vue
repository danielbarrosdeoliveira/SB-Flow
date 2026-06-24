<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import authMiddleware from "~/features/auth/middleware/auth";
import {
  useServices,
  type Service,
} from "~/features/services/composables/use-services";

const ServiceFormModal = defineAsyncComponent(() => import("~/components/ServiceFormModal.vue"));

definePageMeta({
  layout: "dashboard",
  middleware: authMiddleware,
});

const toast = useToast();
const overlay = useOverlay();

const search = ref("");
const categoryFilter = ref("all");
const procedureTypeFilter = ref("");
const currentPage = ref(1);
const pageSize = 8;

const { data: services, isLoading, error, refetch } = useServices();

const filteredServices = computed(() => {
  let list = services.value ?? [];
  if (search.value) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q),
    );
  }
  if (categoryFilter.value && categoryFilter.value !== "all") {
    list = list.filter((s) => s.category === categoryFilter.value);
  }
  if (procedureTypeFilter.value) {
    list = list.filter((s) => s.procedureType === procedureTypeFilter.value);
  }
  return list;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredServices.value.length / pageSize)),
);

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredServices.value.slice(start, start + pageSize);
});

const hasFilters = computed(() => !!search.value || (!!categoryFilter.value && categoryFilter.value !== "all") || !!procedureTypeFilter.value);

watch(categoryFilter, () => {
  procedureTypeFilter.value = "";
});

watch([search, categoryFilter, procedureTypeFilter], () => {
  currentPage.value = 1;
});

const formModal = overlay.create(ServiceFormModal);

function openCreate() {
  formModal.open({ service: null });
}

function openEdit(service: Service) {
  formModal.open({ service });
}
</script>

<template>
  <div class="space-y-6">
    <ServicesHeader
      v-model:search="search"
      v-model:category-filter="categoryFilter"
      v-model:procedure-type-filter="procedureTypeFilter"
      @create="openCreate"
    />

    <ServicesList
      v-model:current-page="currentPage"
      :services="paginatedServices"
      :is-loading="isLoading"
      :error="error"
      :total-items="filteredServices.length"
      :page-size="pageSize"
      :has-filters="hasFilters"
      @edit="openEdit"
      @refetch="refetch"
    />
  </div>
</template>
