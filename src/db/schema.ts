import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm'
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export type InsertUser = InferInsertModel<typeof users>
export type SelectUser = InferSelectModel<typeof users>

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  pseudo: text("pseudo").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  isMember: boolean('isMember'),
  createdAt: timestamp("created_at").defaultNow(),
});