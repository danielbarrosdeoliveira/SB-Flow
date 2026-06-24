<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import authMiddleware from "~/features/auth/middleware/auth";
import {
  useProfessionals,
  useToggleProfessionalActive,
  type Professional,
} from "~/features/professionals/composables/use-professionals";

const ProfessionalFormModal = defineAsyncComponent(() => import("~/components/ProfessionalFormModal.vue"));

definePageMeta({
  layout: "dashboard",
  middleware: authMiddleware,
});

const toast = useToast();
const overlay = useOverlay();

const search = ref("");
const statusFilter = ref<"all" | "active" | "inactive">("all");
const currentPage = ref(1);
const pageSize = 8;

const { data: professionals, isLoading, error, refetch } = useProfessionals();
const { mutateAsync: toggleActive } = useToggleProfessionalActive();

const filteredProfessionals = computed(() => {
  let list = professionals.value ?? [];
  if (search.value) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.cpf.includes(q),
    );
  }
  if (statusFilter.value === "active") {
    list = list.filter((p) => p.isActive);
  } else if (statusFilter.value === "inactive") {
    list = list.filter((p) => !p.isActive);
  }
  return list;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProfessionals.value.length / pageSize)),
);

const paginatedProfessionals = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProfessionals.value.slice(start, start + pageSize);
});

const hasFilters = computed(() => !!search.value || statusFilter.value !== "all");

watch([search, statusFilter], () => {
  currentPage.value = 1;
});

const formModal = overlay.create(ProfessionalFormModal);

function openCreate() {
  formModal.open({ professional: null });
}

function openEdit(prof: Professional) {
  formModal.open({ professional: prof });
}

async function handleToggleActive(prof: Professional, event: Event) {
  event.stopPropagation();
  try {
    await toggleActive(prof.id);
    toast.add({
      title: prof.isActive ? "Profissional desativado(a)" : "Profissional ativado(a)",
      color: "success",
    });
  } catch {
    toast.add({ title: "Erro ao alterar status", color: "error" });
  }
}
</script>

<template>
  <div class="space-y-6">
    <ProfessionalsHeader
      v-model:search="search"
      v-model:status-filter="statusFilter"
      @create="openCreate"
    />

    <ProfessionalsList
      v-model:current-page="currentPage"
      :professionals="paginatedProfessionals"
      :is-loading="isLoading"
      :error="error"
      :total-items="filteredProfessionals.length"
      :page-size="pageSize"
      :has-filters="hasFilters"
      @edit="openEdit"
      @toggle-active="handleToggleActive"
      @refetch="refetch"
    />
  </div>
</template>
