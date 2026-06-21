import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { blocks } from "../../../db/schema/blocks.js";
import type { CreateBlockInput } from "./schema.js";

export interface BlockRow {
  id: number;
  professionalId: number;
  startTime: Date;
  endTime: Date;
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const listFields = {
  id: blocks.id,
  professionalId: blocks.professionalId,
  startTime: blocks.startTime,
  endTime: blocks.endTime,
  reason: blocks.reason,
  createdAt: blocks.createdAt,
  updatedAt: blocks.updatedAt,
} as const;

export async function list(filters: {
  professionalId?: number;
  start?: string;
  end?: string;
}): Promise<BlockRow[]> {
  const conditions: ReturnType<typeof gte>[] = [];

  if (filters.professionalId !== undefined) {
    conditions.push(eq(blocks.professionalId, filters.professionalId));
  }
  if (filters.start) {
    conditions.push(gte(blocks.startTime, new Date(filters.start)));
  }
  if (filters.end) {
    conditions.push(lte(blocks.endTime, new Date(filters.end)));
  }

  return db
    .select(listFields)
    .from(blocks)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
}

export async function create(
  input: CreateBlockInput & { professionalId: number },
): Promise<{ block: BlockRow; warnings: string[] }> {
  let startTime: Date;
  let endTime: Date;

  if (input.allDay) {
    const base = new Date(input.startTime);
    const y = base.getUTCFullYear();
    const m = base.getUTCMonth();
    const d = base.getUTCDate();
    startTime = new Date(Date.UTC(y, m, d, 0, 0, 0));
    endTime = new Date(Date.UTC(y, m, d, 23, 45, 0));
  } else {
    startTime = new Date(input.startTime);
    endTime = new Date(input.endTime);
  }

  const warnings: string[] = [];

  // EDGE-02: Check overlap with existing blocks
  const overlappingBlocks = await db
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

  if (overlappingBlocks.length > 0) {
    warnings.push("Já existe um bloqueio neste período");
  }

  // EDGE-03: Check overlap with active appointments
  // TODO: Add when appointments table exists (BOOKING-01)

  const [row] = await db
    .insert(blocks)
    .values({
      professionalId: input.professionalId,
      startTime,
      endTime,
      reason: input.reason ?? null,
    })
    .returning(listFields);

  return { block: row, warnings };
}

export async function deleteById(id: number, professionalId?: number): Promise<boolean> {
  const conditions = [eq(blocks.id, id)];
  if (professionalId !== undefined) {
    conditions.push(eq(blocks.professionalId, professionalId));
  }
  const [row] = await db
    .delete(blocks)
    .where(and(...conditions))
    .returning({ id: blocks.id });
  return !!row;
}
