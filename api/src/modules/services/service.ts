import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { services } from "../../db/schema/services.js";
import type { CreateServiceInput, UpdateServiceInput } from "./schema.js";

export interface ServiceRow {
  id: number;
  professionalId: number;
  name: string;
  durationMinutes: number;
  price: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const listFields = {
  id: services.id,
  professionalId: services.professionalId,
  name: services.name,
  durationMinutes: services.durationMinutes,
  price: services.price,
  description: services.description,
  isActive: services.isActive,
  createdAt: services.createdAt,
  updatedAt: services.updatedAt,
} as const;

export async function list(professionalId?: number): Promise<ServiceRow[]> {
  if (professionalId !== undefined) {
    return db.select(listFields).from(services).where(eq(services.professionalId, professionalId));
  }
  return db.select(listFields).from(services);
}

export async function getById(id: number): Promise<ServiceRow | undefined> {
  const [row] = await db.select(listFields).from(services).where(eq(services.id, id)).limit(1);
  return row;
}

export async function create(input: CreateServiceInput): Promise<ServiceRow> {
  const [row] = await db
    .insert(services)
    .values({
      professionalId: input.professionalId,
      name: input.name,
      durationMinutes: input.durationMinutes,
      price: String(input.price),
      description: input.description ?? null,
    })
    .returning(listFields);
  return row;
}

export async function update(
  id: number,
  input: UpdateServiceInput,
): Promise<ServiceRow | undefined> {
  const updates: Record<string, unknown> = {};

  if (input.name !== undefined) updates.name = input.name;
  if (input.durationMinutes !== undefined) updates.durationMinutes = input.durationMinutes;
  if (input.price !== undefined) updates.price = String(input.price);
  if (input.description !== undefined) updates.description = input.description;
  if (input.isActive !== undefined) updates.isActive = input.isActive;

  if (Object.keys(updates).length === 0) return getById(id);

  const [row] = await db
    .update(services)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(services.id, id))
    .returning(listFields);
  return row;
}

export async function remove(id: number): Promise<boolean> {
  // Check if service is linked to active appointments
  // TODO: add check when appointments table exists (BOOKING-01)
  // For now, hard delete
  const [row] = await db.delete(services).where(eq(services.id, id)).returning({ id: services.id });
  return !!row;
}

export async function softDelete(id: number): Promise<ServiceRow | undefined> {
  const [row] = await db
    .update(services)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(services.id, id))
    .returning(listFields);
  return row;
}
