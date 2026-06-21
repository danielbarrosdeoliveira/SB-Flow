import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { professionals } from "./professionals";

export const blocks = pgTable("blocks", {
  id: serial("id").primaryKey(),
  professionalId: integer("professional_id")
    .notNull()
    .references(() => professionals.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  reason: varchar("reason", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
