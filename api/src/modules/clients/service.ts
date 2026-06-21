import { eq, like, or } from "drizzle-orm";
import { db } from "../../db/index.js";
import { clients } from "../../db/schema/clients.js";
import { normalizePhone } from "../../lib/phone.js";
import type { CreateClientInput, UpdateClientInput } from "./schema.js";

export interface ClientRow {
  id: number;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const listFields = {
  id: clients.id,
  name: clients.name,
  phone: clients.phone,
  createdAt: clients.createdAt,
  updatedAt: clients.updatedAt,
} as const;

export async function search(query?: string): Promise<ClientRow[]> {
  if (!query || query.trim().length === 0) {
    return db.select(listFields).from(clients).limit(50);
  }

  const term = `%${query.trim()}%`;
  return db
    .select(listFields)
    .from(clients)
    .where(or(like(clients.name, term), like(clients.phone, term)))
    .limit(20);
}

export async function getById(id: number): Promise<ClientRow | undefined> {
  const [row] = await db.select(listFields).from(clients).where(eq(clients.id, id)).limit(1);
  return row;
}

export async function getByPhone(phone: string): Promise<ClientRow | undefined> {
  const normalized = normalizePhone(phone);
  const [row] = await db
    .select(listFields)
    .from(clients)
    .where(eq(clients.phone, normalized))
    .limit(1);
  return row;
}

export async function create(input: CreateClientInput): Promise<ClientRow> {
  const phone = normalizePhone(input.phone);

  const existing = await getByPhone(phone);
  if (existing) {
    throw Object.assign(new Error("Telefone já cadastrado"), { statusCode: 409 });
  }

  const [row] = await db.insert(clients).values({ name: input.name, phone }).returning(listFields);
  return row;
}

export async function update(id: number, input: UpdateClientInput): Promise<ClientRow | undefined> {
  const updates: Record<string, unknown> = {};

  if (input.name !== undefined) updates.name = input.name;
  if (input.phone !== undefined) updates.phone = normalizePhone(input.phone);

  if (Object.keys(updates).length === 0) return getById(id);

  const [row] = await db
    .update(clients)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(clients.id, id))
    .returning(listFields);
  return row;
}
