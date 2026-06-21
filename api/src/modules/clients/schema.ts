import { z } from "zod";

function phoneValidate(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export const createClientSchema = z.object({
  name: z.string().min(2).max(255),
  phone: z.string().refine(phoneValidate, "Telefone inválido"),
});

export const updateClientSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  phone: z.string().refine(phoneValidate, "Telefone inválido").optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
