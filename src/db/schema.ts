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

export const users = pgTable("users", {
  userID: serial("user_id").primaryKey(),
  pseudo: varchar("pseudo", { length: 8 }),
  mail: varchar("email", { length: 20 }),
  password: text("password").notNull(),
  isMember: boolean("isMember"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const sessions = pgTable("sessions", {
  sessionsID: serial("sessions_id").primaryKey(),
  userID: serial("user_id").references(() => users.userID),
  token: text("token").notNull(),
  expirationTime: timestamp("expiration_time").notNull(),
});

export const characters = pgTable("characters", {
  characterID: serial("character_id").primaryKey(),
  name: text("name").notNull(),
  height: integer("height").notNull(),
  weight: integer("weight").notNull(),
  story: text("story"),
  type: varchar("type", { length: 10 }),
  effectiveRange: varchar("effective_range", { length: 10 }),
  easeOfUse: varchar("ease_of_use", { length: 10 }),
  avatar: varchar("avatar", { length: 200 }).notNull(),
  numberOfCombos: integer("number_of_combos").notNull(),
  numberOfLikes: integer("number_of_likes").notNull(),
  numberOfLovers: integer("number_of_lovers").notNull(),
  combos: serial("combos")
    .default(sql`ARRAY[]::text[]`)
    .references(() => combos.comboID),
});

export const combos = pgTable("combos", {
  comboID: serial("combo_id").primaryKey(),
  characterID: serial("character_id").references(() => characters.characterID),
  userID: serial("user_id").references(() => users.userID),
  position: text("position").notNull(),
  combo: text("combo[]")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  likes: integer("likes").notNull(),
  isSaved: boolean("is_saved"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inputs = pgTable("inputs", {
  directions: text("directions[]")
    .array()
    .default(sql`ARRAY[]::text[]`)
    .references(() => combos.combo),
  specialInputs: text("special_inputs[]")
    .default(sql`ARRAY[]::text[]`)
    .array()
    .references(() => combos.combo),
  punches: text("punches[]")
    .array()
    .default(sql`ARRAY[]::text[]`)
    .references(() => combos.combo),
  kicks: text("kicks[]")
    .array()
    .default(sql`ARRAY[]::text[]`)
    .references(() => combos.combo),
});
