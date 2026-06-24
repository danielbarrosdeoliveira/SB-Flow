<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  useCreateProfessional,
  useUpdateProfessional,
  type Professional,
} from "~/features/professionals/composables/use-professionals";
import { maskPhone, unmaskPhone } from "~/utils/phone";

const props = defineProps<{
  professional?: Professional | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const toast = useToast();
const { mutateAsync: createProfessional } = useCreateProfessional();
const { mutateAsync: updateProfessional } = useUpdateProfessional();
const isSubmitting = ref(false);

const isEditing = computed(() => !!props.professional);

const schema = z.object({
  name: z.string().min(2, "Mínimo de 2 caracteres").max(255),
  phone: z
    .string()
    .transform(unmaskPhone)
    .pipe(z.string().min(10, "Telefone inválido").max(11)),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(11, "CPF deve ter 11 dígitos")),
  password: z.string().min(6, "Mínimo de 6 caracteres").optional().or(z.literal("")),
  workHoursStart: z.string().default("08:00"),
  workHoursEnd: z.string().default("20:00"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({});

function initState() {
  if (props.professional) {
    state.name = props.professional.name;
    state.phone = maskPhone(props.professional.phone);
    state.cpf = (props.professional.cpf ?? "").replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      "$1.$2.$3-$4",
    );
    state.password = "";
    state.workHoursStart = props.professional.workHoursStart;
    state.workHoursEnd = props.professional.workHoursEnd;
  } else {
    state.name = "";
    state.phone = "";
    state.cpf = "";
    state.password = "";
    state.workHoursStart = "08:00";
    state.workHoursEnd = "20:00";
  }
}

initState();

const cpfMask = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true;
  try {
    if (isEditing.value && props.professional) {
      const payload: Record<string, string> = {};
      if (event.data.name !== props.professional.name) payload.name = event.data.name;
      if (unmaskPhone(event.data.phone) !== props.professional.phone)
        payload.phone = event.data.phone;
      if (event.data.password && event.data.password.length >= 6)
        payload.password = event.data.password;
      if (event.data.workHoursStart !== props.professional.workHoursStart)
        payload.workHoursStart = event.data.workHoursStart;
      if (event.data.workHoursEnd !== props.professional.workHoursEnd)
        payload.workHoursEnd = event.data.workHoursEnd;

      if (Object.keys(payload).length > 0) {
        await updateProfessional({ id: props.professional.id, data: payload });
      }
      toast.add({ title: "Profissional atualizado(a)", color: "success" });
    } else {
      await createProfessional({
        name: event.data.name,
        phone: event.data.phone,
        cpf: event.data.cpf,
        password: event.data.password ?? "",
        workHoursStart: event.data.workHoursStart,
        workHoursEnd: event.data.workHoursEnd,
      });
      toast.add({ title: "Profissional cadastrado(a)", color: "success" });
    }
    emit("close");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao salvar profissional";
    toast.add({ title: message, color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <UModal
    :title="isEditing ? `Editar ${props.professional?.name}` : 'Novo Profissional'"
    :description="isEditing ? 'Altere os dados da profissional' : 'Cadastre uma nova profissional'"
    :ui="{ footer: 'justify-end' }"
    @update:open="emit('close')"
  >
    <template #body>
      <UForm id="professional-form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Nome completo" required>
          <UInput v-model="state.name" placeholder="Nome da profissional" class="w-full" />
        </UFormField>

        <UFormField name="phone" label="Telefone" required>
          <UInput
            v-model="state.phone"
            placeholder="(11) 99999-9999"
            class="w-full"
            @update:model-value="state.phone = maskPhone(unmaskPhone(state.phone ?? ''))"
          />
        </UFormField>

        <UFormField name="cpf" label="CPF" :required="!isEditing">
          <UInput
            v-model="state.cpf"
            placeholder="000.000.000-00"
            class="w-full"
            :disabled="isEditing"
            @update:model-value="state.cpf = cpfMask(state.cpf ?? '')"
          />
        </UFormField>

        <UFormField
          :label="isEditing ? 'Nova senha (deixe em branco para manter)' : 'Senha'"
          name="password"
          :required="!isEditing"
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            class="w-full"
          />
        </UFormField>

        <UFieldGroup>
          <UFormField name="workHoursStart" label="Início" class="flex-1">
            <UInput v-model="state.workHoursStart" type="time" class="w-full" />
          </UFormField>
          <UFormField name="workHoursEnd" label="Fim" class="flex-1">
            <UInput v-model="state.workHoursEnd" type="time" class="w-full" />
          </UFormField>
        </UFieldGroup>
      </UForm>
    </template>

    <template #footer="{ close }">
      <UButton label="Cancelar" color="neutral" variant="outline" @click="close" />
      <UButton type="submit" form="professional-form" :label="isEditing ? 'Salvar' : 'Cadastrar'" :loading="isSubmitting" />
    </template>
  </UModal>
</template>
