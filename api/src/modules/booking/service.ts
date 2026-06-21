import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { appointments } from "../../db/schema/appointments.js";
import { clients } from "../../db/schema/clients.js";
import { professionals } from "../../db/schema/professionals.js";
import { services } from "../../db/schema/services.js";
import { blocks } from "../../db/schema/blocks.js";
import { normalizePhone } from "../../lib/phone.js";
import type { CreateBookingAppointmentInput } from "./schema.js";

export interface BookingProfessional {
  id: number;
  name: string;
}

export async function listActiveProfessionals(): Promise<BookingProfessional[]> {
  return db
    .select({ id: professionals.id, name: professionals.name })
    .from(professionals)
    .where(eq(professionals.isActive, true));
}

export interface BookingService {
  id: number;
  name: string;
  durationMinutes: number;
  price: string;
  description: string | null;
}

export async function listProfessionalServices(
  professionalId: number,
): Promise<BookingService[]> {
  return db
    .select({
      id: services.id,
      name: services.name,
      durationMinutes: services.durationMinutes,
      price: services.price,
      description: services.description,
    })
    .from(services)
    .where(
      and(eq(services.professionalId, professionalId), eq(services.isActive, true)),
    );
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export async function getAvailableSlots(
  professionalId: number,
  date: string,
): Promise<TimeSlot[]> {
  const prof = await db
    .select({
      workHoursStart: professionals.workHoursStart,
      workHoursEnd: professionals.workHoursEnd,
    })
    .from(professionals)
    .where(eq(professionals.id, professionalId))
    .limit(1);

  if (!prof.length) return [];

  const { workHoursStart, workHoursEnd } = prof[0];
  const [startHour, startMin] = workHoursStart.split(":").map(Number);
  const [endHour, endMin] = workHoursEnd.split(":").map(Number);

  const startMinOfDay = startHour * 60 + startMin;
  const endMinOfDay = endHour * 60 + endMin;

  // Generate 30-min slots
  const slots: TimeSlot[] = [];
  for (let m = startMinOfDay; m < endMinOfDay; m += 30) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push({
      time: `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
      available: true,
    });
  }

  if (slots.length === 0) return [];

  // Fetch existing appointments for this professional on this date
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  const existingAppointments = await db
    .select({ startTime: appointments.startTime, endTime: appointments.endTime })
    .from(appointments)
    .where(
      and(
        eq(appointments.professionalId, professionalId),
        eq(appointments.status, "confirmed"),
        lte(appointments.startTime, dayEnd),
        gte(appointments.endTime, dayStart),
      ),
    );

  // Fetch blocks for this professional on this date
  const existingBlocks = await db
    .select({ startTime: blocks.startTime, endTime: blocks.endTime })
    .from(blocks)
    .where(
      and(
        eq(blocks.professionalId, professionalId),
        lte(blocks.startTime, dayEnd),
        gte(blocks.endTime, dayStart),
      ),
    );

  const occupied: { start: Date; end: Date }[] = [
    ...existingAppointments.map((a) => ({
      start: new Date(a.startTime),
      end: new Date(a.endTime),
    })),
    ...existingBlocks.map((b) => ({
      start: new Date(b.startTime),
      end: new Date(b.endTime),
    })),
  ];

  return slots.map((slot) => {
    const slotStart = new Date(`${date}T${slot.time}:00`);
    const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

    const isOccupied = occupied.some(
      (o) => slotStart < o.end && slotEnd > o.start,
    );

    return { ...slot, available: !isOccupied };
  });
}

export interface CreateBookingResult {
  appointmentId: number;
  clientId: number;
  startTime: string;
  endTime: string;
}

export async function createBooking(
  input: CreateBookingAppointmentInput,
): Promise<CreateBookingResult> {
  const phone = normalizePhone(input.clientPhone);

  // Find or create client
  let clientId: number;
  const existing = await db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.phone, phone))
    .limit(1);

  if (existing.length > 0) {
    clientId = existing[0].id;
  } else {
    const [newClient] = await db
      .insert(clients)
      .values({ name: input.clientName, phone })
      .returning({ id: clients.id });
    clientId = newClient.id;
  }

  // Get service duration
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

  // Check for conflicts
  const [conflict] = await db
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

  if (conflict) {
    throw Object.assign(new Error("Horário indisponível"), { statusCode: 409 });
  }

  // Check blocks
  const [blocked] = await db
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

  if (blocked) {
    throw Object.assign(new Error("Horário bloqueado"), { statusCode: 409 });
  }

  const [apt] = await db
    .insert(appointments)
    .values({
      professionalId: input.professionalId,
      clientId,
      serviceId: input.serviceId,
      startTime,
      endTime,
    })
    .returning({
      appointmentId: appointments.id,
      clientId: appointments.clientId,
      startTime: appointments.startTime,
      endTime: appointments.endTime,
    });

  return {
    appointmentId: apt.appointmentId,
    clientId: apt.clientId,
    startTime: apt.startTime.toISOString(),
    endTime: apt.endTime.toISOString(),
  };
}

export interface ClientAppointment {
  id: number;
  professionalName: string;
  serviceName: string;
  startTime: Date;
  endTime: Date;
  status: string;
}

export async function listClientAppointments(
  phone: string,
): Promise<ClientAppointment[]> {
  const normalized = normalizePhone(phone);
  const client = await db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.phone, normalized))
    .limit(1);

  if (!client.length) return [];

  return db
    .select({
      id: appointments.id,
      professionalName: professionals.name,
      serviceName: services.name,
      startTime: appointments.startTime,
      endTime: appointments.endTime,
      status: appointments.status,
    })
    .from(appointments)
    .innerJoin(professionals, eq(appointments.professionalId, professionals.id))
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(
      and(
        eq(appointments.clientId, client[0].id),
        gte(appointments.startTime, new Date()),
      ),
    )
    .orderBy(appointments.startTime);
}

export async function cancelClientAppointment(
  appointmentId: number,
  phone: string,
): Promise<boolean> {
  const normalized = normalizePhone(phone);
  const client = await db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.phone, normalized))
    .limit(1);

  if (!client.length) return false;

  const [apt] = await db
    .update(appointments)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(
      and(
        eq(appointments.id, appointmentId),
        eq(appointments.clientId, client[0].id),
        eq(appointments.status, "confirmed"),
      ),
    )
    .returning({ id: appointments.id });

  return !!apt;
}
