import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;
export type InsertSession = InferInsertModel<typeof sessions>;
export type InsertCharacter = InferInsertModel<typeof characters>;
export type InsertCombo = InferInsertModel<typeof combos>;
export type InsertInput = InferInsertModel<typeof inputs>;
export type InsertPosition = InferInsertModel<typeof positions>;
export type InsertComboPosition = InferInsertModel<typeof comboPositions>;

export const users = pgTable("users", {
  userID: serial("user_id").primaryKey(),
  pseudo: varchar("pseudo", { length: 8 }).notNull().unique(),
  email: varchar("email", { length: 20 }).notNull().unique(),
  password: text("password").notNull(),
  isPremium: boolean("is_member").default(sql`'false'::boolean`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const sessions = pgTable("sessions", {
  sessionsID: serial("sessions_id").primaryKey(),
  userID: integer("user_id").references(() => users.userID, {
    onDelete: "cascade",
  }),
  token: text("token").notNull(),
  expirationTime: timestamp("expiration_time").notNull(),
});

export const characters = pgTable("characters", {
  characterID: serial("character_id").primaryKey(),
  name: varchar("name", { length: 10 }).notNull().unique(),
  vitality: integer("vitality").notNull(),
  height: integer("height"),
  weight: integer("weight"),
  story: text("story"),
  type: varchar("type", { length: 10 }),
  effectiveRange: varchar("effective_range", { length: 11 }),
  easeOfUse: varchar("ease_of_use", { length: 10 }),
  avatar: varchar("avatar", { length: 200 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 200 }).notNull(),
});

export const combos = pgTable("combos", {
  comboID: serial("combo_id").primaryKey(),
  userID: integer("user_id").references(() => users.userID, {
    onDelete: "cascade",
  }),
  characterID: integer("character_id").references(
    () => characters.characterID,
    { onDelete: "cascade" }
  ),
  comboName: varchar("combo_name", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const positions = pgTable("positions", {
  positionID: serial("position_id").primaryKey(),
  positionName: varchar("position_name", { length: 20 }).notNull().unique(),
});

export const comboPositions = pgTable(
  "combo_positions",
  {
    comboID: integer("combo_id").references(() => combos.comboID, {
      onDelete: "cascade",
    }),
    positionID: integer("position_id").references(() => positions.positionID, {
      onDelete: "cascade",
    }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.comboID, table.positionID] }),
    };
  }
);

export const inputs = pgTable("inputs", {
  inputID: serial("input_id").primaryKey(),
  inputName: varchar("input_name", { length: 20 }).notNull(),
  inputSrc: text("input_src").notNull(),
});

export const comboInputs = pgTable(
  "combo_inputs",
  {
    comboID: integer("combo_id").references(() => combos.comboID, {
      onDelete: "cascade",
    }),
    inputID: integer("input_id").references(() => inputs.inputID, {
      onDelete: "cascade",
    }),
    lineOrder: integer("line_order").notNull(),
    inputOrder: integer("input_order").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [
          table.comboID,
          table.inputID,
          table.lineOrder,
          table.inputOrder,
        ],
      }),
    };
  }
);
