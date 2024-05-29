import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;
export type InsertSession = InferInsertModel<typeof sessions>;
export type InsertCharacter = InferInsertModel<typeof characters>;
export type InsertCombo = InferInsertModel<typeof combos>;
export type InsertInput = InferInsertModel<typeof inputs>;

export const users = pgTable("users", {
  userID: serial("user_id").primaryKey(),
  pseudo: varchar("pseudo", { length: 8 }),
  email: varchar("email", { length: 20 }),
  password: text("password").notNull(),
  isMember: boolean("is_member"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const sessions = pgTable("sessions", {
  sessionsID: serial("sessions_id").primaryKey(),
  userID: integer("user_id").references(() => users.userID, { onDelete: 'cascade' }),
  token: text("token").notNull(),
  expirationTime: timestamp("expiration_time").notNull(),
});

export const characters = pgTable("characters", {
  characterID: serial("character_id").primaryKey(),
  name: varchar("name", { length: 10 }).notNull(),
  vitality: integer("vitality").notNull(),
  height: integer("height").notNull(),
  weight: integer("weight").notNull(),
  story: text("story"),
  type: varchar("type", { length: 10 }),
  effectiveRange: varchar("effective_range", { length: 11 }),
  easeOfUse: varchar("ease_of_use", { length: 10 }),
  avatar: varchar("avatar", { length: 200 }).notNull(),
  numberOfCombos: integer("number_of_combos").notNull(),
  numberOfLikes: integer("number_of_likes").notNull(),
  numberOfLovers: integer("number_of_lovers").notNull(),
});

export const combos = pgTable("combos", {
  comboID: serial("combo_id").primaryKey(),
  characterID: integer("character_id").references(() => characters.characterID, { onDelete: 'cascade' }),
  userID: integer("user_id").references(() => users.userID, { onDelete: 'cascade' }),
  position: text("position").notNull(),
  combo: text("combo[]")
  .array()
  .default(sql`ARRAY[]::text[]`),
  likes: integer("likes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inputs = pgTable("inputs", {
  inputsID: serial("inputs_id").primaryKey(),
  directions: text("directions[]")
    .array()
    .default(sql`ARRAY[]::text[]`),
  specialInputs: text("special_inputs[]")
    .array()
    .default(sql`ARRAY[]::text[]`),
  punches: text("punches[]")
    .array()
    .default(sql`ARRAY[]::text[]`),
  kicks: text("kicks[]")
    .array()
    .default(sql`ARRAY[]::text[]`),
});
