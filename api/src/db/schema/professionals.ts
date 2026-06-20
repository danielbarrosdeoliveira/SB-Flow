import { boolean, char, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const professionals = pgTable("professionals", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  cpf: char("cpf", { length: 11 }).notNull().unique(),
  phone: varchar("phone", { length: 11 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("PARTNER"),
  isActive: boolean("is_active").notNull().default(true),
  workHoursStart: varchar("work_hours_start", { length: 5 }).notNull().default("08:00"),
  workHoursEnd: varchar("work_hours_end", { length: 5 }).notNull().default("20:00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
