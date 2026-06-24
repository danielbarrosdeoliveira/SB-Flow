<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  useCreateService,
  useUpdateService,
  type Service,
} from "~/features/services/composables/use-services";

const props = defineProps<{
  service?: Service | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const toast = useToast();
const { mutateAsync: createService } = useCreateService();
const { mutateAsync: updateService } = useUpdateService();
const isSubmitting = ref(false);

const isEditing = computed(() => !!props.service);

// ── Form state ──

interface Variant {
  id: number;
  name: string;
  price: string;
  duration: string;
}

let variantIdCounter = 0;

const hasVariants = ref(false);
const name = ref("");
const description = ref("");
const price = ref("");
const duration = ref("");
const variants = ref<Variant[]>([]);

function initState() {
  if (props.service) {
    name.value = props.service.name;
    description.value = props.service.description ?? "";
    hasVariants.value = props.service.parentId === null && (props.service.durationMinutes === null || props.service.price === null);
    if (hasVariants.value) {
      price.value = "";
      duration.value = "";
    } else {
      price.value = props.service.price ? Number(props.service.price).toFixed(2) : "";
      duration.value = props.service.durationMinutes ? String(props.service.durationMinutes) : "";
    }
  } else {
    name.value = "";
    description.value = "";
    price.value = "";
    duration.value = "";
    variants.value = [];
    hasVariants.value = false;
  }
}

initState();

function addVariant() {
  variantIdCounter++;
  variants.value.push({ id: variantIdCounter, name: "", price: "", duration: "" });
}

function removeVariant(id: number) {
  variants.value = variants.value.filter((v) => v.id !== id);
}

function formatPrice(value: string): string {
  const num = Number(value.replace(",", "."));
  if (Number.isNaN(num)) return "R$ 0,00";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const totalPrice = computed(() => {
  if (!hasVariants.value) {
    if (!price.value) return "";
    return formatPrice(price.value);
  }
  const total = variants.value.reduce((sum, v) => {
    const p = Number(v.price.replace(",", "."));
    return sum + (Number.isNaN(p) ? 0 : p);
  }, 0);
  if (total === 0) return "";
  return formatPrice(String(total));
});

const canSubmit = computed(() => {
  if (!name.value) return false;
  if (hasVariants.value) {
    return variants.value.length > 0 && variants.value.every((v) => v.name && v.price && v.duration);
  }
  return !!price.value && !!duration.value;
});

async function onSubmit() {
  if (!canSubmit.value) return;
  isSubmitting.value = true;
  try {
    if (isEditing.value && props.service) {
      // Edit mode - use existing update flow
      const payload: Record<string, unknown> = {};
      if (name.value !== props.service.name) payload.name = name.value;
      if (description.value !== (props.service.description ?? "")) payload.description = description.value || null;

      if (hasVariants.value) {
        payload.durationMinutes = null;
        payload.price = null;
      } else {
        const priceNum = Number(price.value.replace(",", "."));
        const durationNum = Number(duration.value);
        if (priceNum !== Number(props.service.price)) payload.price = priceNum;
        if (durationNum !== props.service.durationMinutes) payload.durationMinutes = durationNum;
      }

      if (Object.keys(payload).length > 0) {
        await updateService({ id: props.service.id, data: payload });
      }
      toast.add({ title: "Serviço atualizado", color: "success" });
      emit("close");
      return;
    }

    // ── Create mode ──
    if (hasVariants.value) {
      // Create parent
      const parent = await createService({
        professionalId: 1,
        name: name.value,
        description: description.value || undefined,
      });

      // Create each child with parentId
      for (const v of variants.value) {
        await createService({
          professionalId: 1,
          name: v.name,
          price: Number(v.price.replace(",", ".")),
          durationMinutes: Number(v.duration),
          parentId: parent.id,
        });
      }

      toast.add({
        title: `"${name.value}" cadastrado com ${variants.value.length} variação${variants.value.length !== 1 ? "ões" : ""}`,
        color: "success",
      });
    } else {
      await createService({
        professionalId: 1,
        name: name.value,
        description: description.value || undefined,
        price: Number(price.value.replace(",", ".")),
        durationMinutes: Number(duration.value),
      });
      toast.add({ title: "Serviço cadastrado", color: "success" });
    }

    emit("close");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao salvar serviço";
    toast.add({ title: message, color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <UModal
    :title="isEditing ? `Editar ${props.service?.name}` : 'Novo Serviço'"
    :description="isEditing ? 'Altere os dados do serviço' : 'Cadastre um novo serviço'"
    size="lg"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('close')"
  >
    <template #body>
      <div class="space-y-5">
        <!-- Nome -->
        <UFormField label="Nome do serviço" required>
          <UInput
            v-model="name"
            placeholder="Ex: Extensão de Cílios - Manutenção"
            class="w-full"
          />
        </UFormField>

        <!-- Descrição -->
        <UFormField label="Descrição">
          <UTextarea
            v-model="description"
            placeholder="Regras do procedimento, condições de manutenção, observações..."
            class="w-full"
            :rows="3"
          />
        </UFormField>

        <!-- Separador -->
        <div class="border-t border-border pt-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-foreground">Este serviço possui variações/sub-tipos?</p>
              <p class="text-xs text-muted mt-0.5">Ex: Volume Russo, Volume Híbrido</p>
            </div>
            <USwitch v-model="hasVariants" size="lg" />
          </div>
        </div>

        <!-- Serviço Simples (sem variações) -->
        <div v-if="!hasVariants" class="grid grid-cols-2 gap-4">
          <UFormField label="Preço (R$)">
            <UInput
              v-model="price"
              placeholder="0,00"
              type="text"
              inputmode="decimal"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Duração (minutos)">
            <UInput
              v-model="duration"
              placeholder="30"
              type="number"
              min="1"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Serviço Pai (com variações) -->
        <div v-else class="space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-foreground">Variações / Sub-tipos</p>
            <UButton
              size="sm"
              color="primary"
              variant="soft"
              leading-icon="i-lucide-plus"
              @click="addVariant"
            >
              Adicionar Variação
            </UButton>
          </div>

          <div v-if="variants.length === 0" class="text-center py-6 border border-dashed border-border rounded-xl">
            <UIcon name="i-lucide-package-plus" class="w-8 h-8 mx-auto text-muted" />
            <p class="text-sm text-muted mt-2">Nenhuma variação cadastrada</p>
            <p class="text-xs text-muted mt-0.5">Clique em "Adicionar Variação" para começar</p>
          </div>

          <div v-for="(v, idx) in variants" :key="v.id" class="flex items-start gap-2 p-3 rounded-xl border border-border bg-warm-50 dark:bg-warm-900/10">
            <div class="flex-1 grid grid-cols-3 gap-2">
              <UInput
                v-model="v.name"
                placeholder="Nome (ex: Volume Russo)"
                size="sm"
              />
              <UInput
                v-model="v.price"
                placeholder="Preço"
                size="sm"
                inputmode="decimal"
              />
              <UInput
                v-model="v.duration"
                placeholder="Duração (min)"
                type="number"
                min="1"
                size="sm"
              />
            </div>
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              :square="true"
              class="mt-0.5 shrink-0"
              @click="removeVariant(v.id)"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex items-center justify-between w-full gap-3">
        <div class="text-sm">
          <span v-if="totalPrice" class="font-semibold text-foreground">Total: {{ totalPrice }}</span>
          <span v-if="hasVariants && variants.length > 0" class="text-muted ml-2">
            ({{ variants.length }} variação{{ variants.length !== 1 ? "ões" : "" }})
          </span>
        </div>
        <div class="flex items-center gap-2">
          <UButton label="Cancelar" color="neutral" variant="outline" size="md" @click="close" />
          <UButton
            :disabled="!canSubmit"
            :loading="isSubmitting"
            size="md"
            @click="onSubmit"
          >
            {{ isEditing ? "Salvar" : "Cadastrar" }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
