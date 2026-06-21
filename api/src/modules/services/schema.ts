import { z } from "zod";

export const createServiceSchema = z.object({
  professionalId: z.number(),
  name: z.string().min(2).max(255),
  durationMinutes: z.number().int().min(5).max(1440),
  price: z.number().positive(),
  description: z.string().max(1000).optional(),
});

export const updateServiceSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  durationMinutes: z.number().int().min(5).max(1440).optional(),
  price: z.number().positive().optional(),
  description: z.string().max(1000).optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
