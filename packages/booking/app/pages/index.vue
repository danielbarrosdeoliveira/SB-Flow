<script setup lang="ts">
import { useServiceCatalog, type CatalogItem, type ParentService } from "~/composables/use-service-catalog";

const { parents, formatPrice } = useServiceCatalog();

const search = ref("");
const selectedCategory = ref("all");
const expandedParent = ref<number | null>(null);
const selectedChild = ref<CatalogItem | null>(null);

const categories = [
  { label: "Todos", value: "all" },
  { label: "Cabelo", value: "Cabelo" },
  { label: "Unhas", value: "Unhas" },
  { label: "Estética", value: "Estética" },
];

const filteredParents = computed(() => {
  let list = parents.value;
  if (search.value) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q),
    );
  }
  if (selectedCategory.value && selectedCategory.value !== "all") {
    list = list.filter((p) => p.category === selectedCategory.value);
  }
  return list;
});

function toggleParent(id: number) {
  expandedParent.value = expandedParent.value === id ? null : id;
}

function selectChild(child: CatalogItem) {
  selectedChild.value = child;
  const parent = parents.value.find((p) => p.id === child.parentId);
  if (parent) expandedParent.value = parent.id;
}

function clearSelection() {
  selectedChild.value = null;
}
</script>

<template>
  <div class="min-h-screen bg-sb-white">
    <!-- Header -->
    <header class="bg-gradient-to-b from-sb-primary-light/30 to-transparent px-4 pt-10 pb-6 text-center">
      <h1 class="font-cursive text-4xl text-sb-dark">Studio Blessed</h1>
      <p class="text-sb-warm text-sm mt-1">Escolha o serviço desejado</p>
    </header>

    <!-- Filters -->
    <div class="sticky top-0 z-10 bg-sb-white/95 backdrop-blur-sm px-4 pb-3 pt-2 space-y-3">
      <!-- Category pills -->
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
          :class="selectedCategory === cat.value
            ? 'bg-sb-primary text-white shadow-md shadow-sb-primary/30'
            : 'bg-sb-sand/50 text-sb-warm hover:bg-sb-sand/80'"
          @click="selectedCategory = cat.value"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Search -->
      <div class="relative max-w-md mx-auto">
        <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sb-warm/60" />
        <input
          v-model="search"
          type="text"
          placeholder="Buscar serviço..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sb-sand/60 bg-white text-sm text-sb-dark placeholder:text-sb-warm/40 outline-none focus:border-sb-primary focus:ring-1 focus:ring-sb-primary/30 transition-all"
        />
        <button
          v-if="search"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-sb-warm/50 hover:text-sb-warm"
          @click="search = ''"
        >
          <Icon icon="lucide:x" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Service list -->
    <main class="px-4 pb-32 max-w-xl mx-auto space-y-3 mt-3">
      <p v-if="filteredParents.length === 0" class="text-center text-sb-warm/60 py-12 text-sm">
        Nenhum serviço encontrado
      </p>

      <div
        v-for="parent in filteredParents"
        :key="parent.id"
        class="rounded-2xl border transition-all duration-200 overflow-hidden"
        :class="expandedParent === parent.id
          ? 'border-sb-primary/40 shadow-md shadow-sb-primary/10'
          : 'border-sb-sand/60 hover:border-sb-primary/30 hover:shadow-sm'"
      >
        <!-- Parent header (collapsible) -->
        <button
          class="w-full flex items-start gap-3 p-4 text-left"
          @click="toggleParent(parent.id)"
        >
          <div
            class="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-colors duration-200"
            :class="expandedParent === parent.id
              ? 'bg-sb-primary text-white'
              : 'bg-sb-sand/50 text-sb-primary'"
          >
            <Icon icon="lucide:sparkles" class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0 pt-0.5">
            <h3 class="font-semibold text-sb-dark text-base">{{ parent.name }}</h3>
            <p class="text-xs text-sb-warm/70 mt-0.5 line-clamp-2 leading-relaxed">
              {{ parent.description }}
            </p>
          </div>
          <Icon
            :icon="expandedParent === parent.id ? 'lucide:chevron-up' : 'lucide:chevron-down'"
            class="w-5 h-5 text-sb-warm/50 mt-2 shrink-0 transition-transform duration-200"
          />
        </button>

        <!-- Children list (expandable) -->
        <div
          v-show="expandedParent === parent.id"
          class="border-t border-sb-sand/40 bg-sb-sand/10"
        >
          <div class="p-2 space-y-1">
            <label
              v-for="child in parent.children"
              :key="child.id"
              class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150"
              :class="selectedChild?.id === child.id
                ? 'bg-sb-primary/10 ring-1 ring-sb-primary/40'
                : 'hover:bg-sb-sand/30'"
              @click="selectChild(child)"
            >
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                :class="selectedChild?.id === child.id
                  ? 'border-sb-primary bg-sb-primary'
                  : 'border-sb-warm/40'"
              >
                <div v-if="selectedChild?.id === child.id" class="w-2 h-2 rounded-full bg-white" />
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-sb-dark">{{ child.name }}</p>
                <p v-if="child.description" class="text-xs text-sb-warm/60 mt-0.5 line-clamp-1">
                  {{ child.description }}
                </p>
              </div>

              <div class="text-right shrink-0">
                <p class="text-sm font-bold text-sb-dark">{{ formatPrice(child.price) }}</p>
                <p class="text-xs text-sb-warm/60 flex items-center gap-1 justify-end mt-0.5">
                  <Icon icon="lucide:clock" class="w-3 h-3" />
                  {{ child.durationMinutes }} min
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom bar with selected service -->
    <div
      v-if="selectedChild"
      class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-sb-sand/60 px-4 py-3"
    >
      <div class="max-w-xl mx-auto flex items-center gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-xs text-sb-warm/60">Serviço selecionado</p>
          <p class="text-sm font-semibold text-sb-dark truncate">{{ selectedChild.name }}</p>
        </div>
        <p class="text-sm font-bold text-sb-primary shrink-0">{{ formatPrice(selectedChild.price) }}</p>
        <button
          class="bg-sb-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-sb-primary/30 hover:bg-sb-primary-dark transition-all active:scale-[0.98]"
          @click="clearSelection"
        >
          Continuar
        </button>
      </div>
    </div>
  </div>
</template>
