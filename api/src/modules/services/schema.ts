import { z } from "zod";

export const createServiceSchema = z.object({
  professionalId: z.number(),
  name: z.string().min(2).max(255),
  durationMinutes: z.number().int().min(5).max(1440).optional(),
  price: z.number().positive().optional(),
  description: z.string().max(1000).optional(),
  category: z.enum(["Cabelo", "Unhas", "Estética"]).optional(),
  procedureType: z.string().max(100).optional(),
  parentId: z.number().optional(),
});

export const updateServiceSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  durationMinutes: z.number().int().min(5).max(1440).optional(),
  price: z.number().positive().optional(),
  description: z.string().max(1000).optional().nullable(),
  isActive: z.boolean().optional(),
  category: z.enum(["Cabelo", "Unhas", "Estética"]).optional().nullable(),
  procedureType: z.string().max(100).optional().nullable(),
  parentId: z.number().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
