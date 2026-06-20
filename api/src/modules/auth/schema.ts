import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const loginResponseSchema = z.object({
  user: z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    role: z.string(),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

export type RefreshInput = z.infer<typeof refreshSchema>;
