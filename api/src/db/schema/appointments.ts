import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { professionals } from "./professionals";
import { services } from "./services";

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  professionalId: integer("professional_id")
    .notNull()
    .references(() => professionals.id),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("confirmed"),
  notes: text("notes"),
  cancelledBy: integer("cancelled_by").references(() => professionals.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
