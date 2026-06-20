import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../lib/env.js";
import * as schema from "./schema/index";

const queryClient = postgres(env.DATABASE_URL, { prepare: true });
export const db = drizzle(queryClient, { schema });
export type Db = typeof db;
