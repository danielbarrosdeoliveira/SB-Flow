import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";
import { env } from "../lib/env.js";
import { professionals } from "./schema/index.js";

const seedSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  cpf: z.string().min(11),
  password: z.string().min(6),
});

const seedEnv = seedSchema.parse({
  name: env.SEED_ADMIN_NAME,
  phone: env.SEED_ADMIN_PHONE,
  cpf: env.SEED_ADMIN_CPF,
  password: env.SEED_ADMIN_PASSWORD,
});

const seedClient = postgres(env.DATABASE_URL, { max: 1 });
const db = drizzle(seedClient);

const passwordHash = await bcrypt.hash(seedEnv.password, 10);

await db
  .insert(professionals)
  .values({
    name: seedEnv.name,
    phone: seedEnv.phone,
    cpf: seedEnv.cpf,
    passwordHash,
    role: "OWNER",
    isActive: true,
  })
  .onConflictDoNothing();

console.log("Seed complete: OWNER admin created.");

await seedClient.end();
