import {
  boolean,
  foreignKey,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { professionals } from "./professionals";

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  professionalId: integer("professional_id")
    .notNull()
    .references(() => professionals.id),
  name: varchar("name", { length: 255 }).notNull(),
  durationMinutes: integer("duration_minutes"),
  price: numeric("price", { precision: 10, scale: 2 }),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  category: varchar("category", { length: 50 }),
  procedureType: varchar("procedure_type", { length: 100 }),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  parentFk: foreignKey({ columns: [table.parentId], foreignColumns: [table.id] }),
}));
