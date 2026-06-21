import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "node:path";
import postgres from "postgres";
import { env } from "../lib/env.js";

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
const db = drizzle(migrationClient);

console.log("Running migrations...");
await migrate(db, {
  migrationsFolder: resolve(import.meta.dirname, "migrations"),
});
console.log("Migrations complete.");

await migrationClient.end();
