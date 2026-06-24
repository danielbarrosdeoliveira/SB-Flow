<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  useCreateClient,
  useUpdateClient,
  type Client,
} from "~/features/clients/composables/use-clients";
import { maskPhone, unmaskPhone } from "~/utils/phone";

const props = defineProps<{
  client?: Client | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const toast = useToast();
const { mutateAsync: createClient } = useCreateClient();
const { mutateAsync: updateClient } = useUpdateClient();
const isSubmitting = ref(false);

const isEditing = computed(() => !!props.client);

const schema = z.object({
  name: z.string().min(2, "Mínimo de 2 caracteres").max(255),
  phone: z
    .string()
    .transform(unmaskPhone)
    .pipe(z.string().min(10, "Telefone inválido").max(11)),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({});

function initState() {
  if (props.client) {
    state.name = props.client.name;
    state.phone = maskPhone(props.client.phone);
  } else {
    state.name = "";
    state.phone = "";
  }
}

initState();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true;
  try {
    if (isEditing.value && props.client) {
      const payload: Record<string, string> = {};
      if (event.data.name !== props.client.name) payload.name = event.data.name;
      if (unmaskPhone(event.data.phone) !== props.client.phone)
        payload.phone = event.data.phone;

      if (Object.keys(payload).length > 0) {
        await updateClient({ id: props.client.id, data: payload });
      }
      toast.add({ title: "Cliente atualizado(a)", color: "success" });
    } else {
      await createClient({ name: event.data.name, phone: event.data.phone });
      toast.add({ title: "Cliente cadastrado(a)", color: "success" });
    }
    emit("close");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao salvar cliente";
    toast.add({ title: message, color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <UModal
    :title="isEditing ? `Editar ${props.client?.name}` : 'Novo Cliente'"
    :description="isEditing ? 'Altere os dados do cliente' : 'Cadastre um novo cliente'"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('close')"
  >
    <template #body>
      <UForm id="client-form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Nome completo" required>
          <UInput v-model="state.name" placeholder="Nome do cliente" class="w-full" />
        </UFormField>

        <UFormField name="phone" label="Telefone" required>
          <UInput
            v-model="state.phone"
            placeholder="(11) 99999-9999"
            class="w-full"
            @update:model-value="state.phone = maskPhone(unmaskPhone(state.phone ?? ''))"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer="{ close }">
      <UButton label="Cancelar" color="neutral" variant="outline" @click="close" />
      <UButton
        type="submit"
        form="client-form"
        :label="isEditing ? 'Salvar' : 'Cadastrar'"
        :loading="isSubmitting"
      />
    </template>
  </UModal>
</template>
