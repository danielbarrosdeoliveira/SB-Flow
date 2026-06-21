import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { professionals } from "../../db/schema/professionals.js";
import { normalizePhone } from "../../lib/phone.js";
import type { CreateProfessionalInput, UpdateProfessionalInput } from "./schema.js";

export interface ProfessionalRow {
  id: number;
  name: string;
  phone: string;
  cpf: string;
  role: string;
  isActive: boolean;
  workHoursStart: string;
  workHoursEnd: string;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string;
}

const listFields = {
  id: professionals.id,
  name: professionals.name,
  phone: professionals.phone,
  cpf: professionals.cpf,
  role: professionals.role,
  isActive: professionals.isActive,
  workHoursStart: professionals.workHoursStart,
  workHoursEnd: professionals.workHoursEnd,
  createdAt: professionals.createdAt,
  updatedAt: professionals.updatedAt,
  passwordHash: professionals.passwordHash,
} as const;

export async function listAll(): Promise<ProfessionalRow[]> {
  return db.select(listFields).from(professionals);
}

export async function listOwn(professionalId: number): Promise<ProfessionalRow[]> {
  return db.select(listFields).from(professionals).where(eq(professionals.id, professionalId));
}

export async function getById(id: number): Promise<ProfessionalRow | undefined> {
  const [row] = await db
    .select(listFields)
    .from(professionals)
    .where(eq(professionals.id, id))
    .limit(1);
  return row;
}

export async function create(input: CreateProfessionalInput): Promise<ProfessionalRow> {
  const phone = normalizePhone(input.phone);
  const cpf = input.cpf.replace(/\D/g, "");
  const passwordHash = await bcrypt.hash(input.password, 10);

  // Prevent unique constraint violations with user-friendly messages
  const existing = await db
    .select({ id: professionals.id, phone: professionals.phone, cpf: professionals.cpf })
    .from(professionals)
    .where(eq(professionals.phone, phone))
    .limit(1);

  if (existing.length > 0) {
    throw Object.assign(new Error("Telefone já cadastrado"), { statusCode: 409 });
  }

  const existingCpf = await db
    .select({ id: professionals.id })
    .from(professionals)
    .where(eq(professionals.cpf, cpf))
    .limit(1);

  if (existingCpf.length > 0) {
    throw Object.assign(new Error("CPF já cadastrado"), { statusCode: 409 });
  }

  const [row] = await db
    .insert(professionals)
    .values({
      name: input.name,
      phone,
      cpf,
      passwordHash,
      role: "PARTNER",
      isActive: true,
      workHoursStart: input.workHoursStart ?? "08:00",
      workHoursEnd: input.workHoursEnd ?? "20:00",
    })
    .returning(listFields);

  return row;
}

export async function update(
  id: number,
  input: UpdateProfessionalInput,
  isOwner: boolean,
): Promise<ProfessionalRow | undefined> {
  const updates: Record<string, unknown> = {};

  if (input.name !== undefined) updates.name = input.name;
  if (input.phone !== undefined) updates.phone = normalizePhone(input.phone);
  if (input.password !== undefined) updates.passwordHash = await bcrypt.hash(input.password, 10);
  if (input.workHoursStart !== undefined) updates.workHoursStart = input.workHoursStart;
  if (input.workHoursEnd !== undefined) updates.workHoursEnd = input.workHoursEnd;

  if (isOwner && "cpf" in input) {
    const extended = input as UpdateProfessionalInput & {
      cpf?: string;
      role?: string;
      isActive?: boolean;
    };
    if (extended.cpf !== undefined) updates.cpf = extended.cpf.replace(/\D/g, "");
    if (extended.role !== undefined) updates.role = extended.role;
    if (extended.isActive !== undefined) updates.isActive = extended.isActive;
  }

  if (Object.keys(updates).length === 0) return getById(id);

  const [row] = await db
    .update(professionals)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(professionals.id, id))
    .returning(listFields);

  return row;
}

export async function toggleActive(id: number): Promise<ProfessionalRow | undefined> {
  const current = await getById(id);
  if (!current) return undefined;

  const [row] = await db
    .update(professionals)
    .set({ isActive: !current.isActive, updatedAt: new Date() })
    .where(eq(professionals.id, id))
    .returning(listFields);

  return row;
}
