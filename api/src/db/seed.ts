import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../lib/env.js";
import { professionals } from "./schema/index.js";

const seedClient = postgres(env.DATABASE_URL, { max: 1 });
const db = drizzle(seedClient);

const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 10);

await db
  .insert(professionals)
  .values({
    name: env.SEED_ADMIN_NAME,
    phone: env.SEED_ADMIN_PHONE,
    cpf: env.SEED_ADMIN_CPF,
    passwordHash,
    role: "OWNER",
    isActive: true,
  })
  .onConflictDoNothing();

console.log("Seed complete: OWNER admin created.");

await seedClient.end();
