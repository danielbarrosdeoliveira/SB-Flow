import { z } from "zod";

export const statusEnum = ["confirmed", "cancelled", "completed", "no_show"] as const;

export const createAppointmentSchema = z.object({
  professionalId: z.number(),
  clientId: z.number(),
  serviceId: z.number(),
  startTime: z.string(),
  notes: z.string().max(1000).optional(),
});

export const updateAppointmentSchema = z.object({
  professionalId: z.number().optional(),
  clientId: z.number().optional(),
  serviceId: z.number().optional(),
  startTime: z.string().optional(),
  notes: z.string().max(1000).optional().nullable(),
});

export const cancelAppointmentSchema = z.object({
  cancelledBy: z.number(),
});

export const setStatusSchema = z.object({
  status: z.enum(statusEnum),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
export type SetStatusInput = z.infer<typeof setStatusSchema>;
