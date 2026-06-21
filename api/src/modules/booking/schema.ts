import { z } from "zod";

export const createBookingAppointmentSchema = z.object({
  professionalId: z.number(),
  serviceId: z.number(),
  startTime: z.string(),
  clientName: z.string().min(2).max(255),
  clientPhone: z.string().min(10).max(11),
});

export type CreateBookingAppointmentInput = z.infer<typeof createBookingAppointmentSchema>;

export const cancelBookingAppointmentSchema = z.object({
  phone: z.string().min(10).max(11),
});
