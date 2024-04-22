import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm'
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export type InsertUser = InferInsertModel<typeof users>
export type SelectUser = InferSelectModel<typeof users>
export type InsertSession = InferInsertModel<typeof sessions>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  pseudo: text("pseudo").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  isMember: boolean('isMember'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull(),
  token: text("token").notNull(),
  expirationTime: timestamp("expiration_time").notNull(),
});