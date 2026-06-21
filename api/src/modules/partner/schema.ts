import { z } from "zod";

function cpfValidate(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== Number(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === Number(digits[10]);
}

export const createProfessionalSchema = z.object({
  name: z.string().min(2).max(255),
  phone: z.string().min(10).max(11),
  cpf: z.string().refine(cpfValidate, "CPF inválido"),
  password: z.string().min(6),
  workHoursStart: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato HH:mm")
    .default("08:00"),
  workHoursEnd: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato HH:mm")
    .default("20:00"),
});

export const updateProfessionalSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  phone: z.string().min(10).max(11).optional(),
  password: z.string().min(6).optional(),
  workHoursStart: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato HH:mm")
    .optional(),
  workHoursEnd: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato HH:mm")
    .optional(),
});

export const ownerUpdateProfessionalSchema = updateProfessionalSchema.extend({
  cpf: z.string().refine(cpfValidate, "CPF inválido").optional(),
  role: z.enum(["OWNER", "PARTNER"]).optional(),
  isActive: z.boolean().optional(),
});

export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;
export type UpdateProfessionalInput = z.infer<typeof updateProfessionalSchema>;
