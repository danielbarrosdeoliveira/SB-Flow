import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db/index.js";
import { appointments } from "../../db/schema/appointments.js";
import { blocks } from "../../db/schema/blocks.js";
import { services } from "../../db/schema/services.js";
import type { CreateAppointmentInput, UpdateAppointmentInput } from "./schema.js";

export interface AppointmentRow {
  id: number;
  professionalId: number;
  clientId: number;
  serviceId: number;
  startTime: Date;
  endTime: Date;
  status: string;
  notes: string | null;
  cancelledBy: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const listFields = {
  id: appointments.id,
  professionalId: appointments.professionalId,
  clientId: appointments.clientId,
  serviceId: appointments.serviceId,
  startTime: appointments.startTime,
  endTime: appointments.endTime,
  status: appointments.status,
  notes: appointments.notes,
  cancelledBy: appointments.cancelledBy,
  createdAt: appointments.createdAt,
  updatedAt: appointments.updatedAt,
} as const;

export async function list(filters: {
  professionalId?: number;
  start?: string;
  end?: string;
}): Promise<AppointmentRow[]> {
  const conditions: ReturnType<typeof gte>[] = [];

  if (filters.professionalId !== undefined) {
    conditions.push(eq(appointments.professionalId, filters.professionalId));
  }
  if (filters.start) {
    conditions.push(gte(appointments.startTime, new Date(filters.start)));
  }
  if (filters.end) {
    conditions.push(lte(appointments.endTime, new Date(filters.end)));
  }

  return db
    .select(listFields)
    .from(appointments)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
}

export async function getById(id: number): Promise<AppointmentRow | undefined> {
  const [row] = await db
    .select(listFields)
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1);
  return row;
}

export async function create(input: CreateAppointmentInput): Promise<AppointmentRow> {
  const [service] = await db
    .select({ durationMinutes: services.durationMinutes })
    .from(services)
    .where(eq(services.id, input.serviceId))
    .limit(1);

  if (!service) {
    throw Object.assign(new Error("Serviço não encontrado"), { statusCode: 404 });
  }

  const startTime = new Date(input.startTime);
  const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);

  // Check for conflicts with existing appointments
  const [conflictingAppointment] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.professionalId, input.professionalId),
        eq(appointments.status, "confirmed"),
        lte(appointments.startTime, endTime),
        gte(appointments.endTime, startTime),
      ),
    )
    .limit(1);

  if (conflictingAppointment) {
    throw Object.assign(new Error("Conflito de horário"), { statusCode: 409 });
  }

  // Check for conflicts with blocks
  const [conflictingBlock] = await db
    .select({ id: blocks.id })
    .from(blocks)
    .where(
      and(
        eq(blocks.professionalId, input.professionalId),
        lte(blocks.startTime, endTime),
        gte(blocks.endTime, startTime),
      ),
    )
    .limit(1);

  if (conflictingBlock) {
    throw Object.assign(new Error("Horário bloqueado"), { statusCode: 409 });
  }

  const [row] = await db
    .insert(appointments)
    .values({
      professionalId: input.professionalId,
      clientId: input.clientId,
      serviceId: input.serviceId,
      startTime,
      endTime,
      notes: input.notes ?? null,
    })
    .returning(listFields);

  return row;
}

export async function update(
  id: number,
  input: UpdateAppointmentInput,
): Promise<AppointmentRow | undefined> {
  const existing = await getById(id);
  if (!existing) return undefined;

  // EDGE-07: Cannot edit past appointments
  if (new Date(existing.startTime) < new Date()) {
    throw Object.assign(new Error("Agendamento passado não pode ser editado"), { statusCode: 422 });
  }

  const updates: Record<string, unknown> = {};

  if (input.professionalId !== undefined) updates.professionalId = input.professionalId;
  if (input.clientId !== undefined) updates.clientId = input.clientId;
  if (input.notes !== undefined) updates.notes = input.notes;

  if (input.serviceId !== undefined || input.startTime !== undefined) {
    const serviceId = input.serviceId ?? existing.serviceId;
    const startTime = input.startTime ? new Date(input.startTime) : existing.startTime;

    const [service] = await db
      .select({ durationMinutes: services.durationMinutes })
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (!service) {
      throw Object.assign(new Error("Serviço não encontrado"), { statusCode: 404 });
    }

    if (input.serviceId !== undefined) updates.serviceId = serviceId;
    if (input.startTime !== undefined) updates.startTime = startTime;
    updates.endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);
  }

  if (Object.keys(updates).length === 0) return existing;

  const [row] = await db
    .update(appointments)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(appointments.id, id))
    .returning(listFields);

  return row;
}

export async function cancel(id: number, cancelledBy: number): Promise<AppointmentRow | undefined> {
  const existing = await getById(id);
  if (!existing) return undefined;

  // Past appointments: keep as cancelled but don't free the slot
  // Future appointments: free the slot
  const [row] = await db
    .update(appointments)
    .set({
      status: "cancelled",
      cancelledBy,
      updatedAt: new Date(),
    })
    .where(eq(appointments.id, id))
    .returning(listFields);

  return row;
}

export async function setStatus(id: number, status: string): Promise<AppointmentRow | undefined> {
  const existing = await getById(id);
  if (!existing) return undefined;

  // Cannot change cancelled status
  if (existing.status === "cancelled") {
    throw Object.assign(new Error("Agendamento cancelado não pode ser alterado"), {
      statusCode: 422,
    });
  }

  const [row] = await db
    .update(appointments)
    .set({ status, updatedAt: new Date() })
    .where(eq(appointments.id, id))
    .returning(listFields);

  return row;
}
