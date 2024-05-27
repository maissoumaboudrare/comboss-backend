import { sql } from "drizzle-orm";
import { db } from "./db/db";
import * as schema from "./db/schema";
import { InsertUser, InsertSession, InsertCharacter, InsertCombo, InsertInput } from "./db/schema";
import * as argon2 from "argon2";

// USER
export const getUsers = async () => {
  const users = await db.select().from(schema.users);

  return users;
};

export const getUser = async (id: string) => {
  const user = await db
    .select()
    .from(schema.users)
    .where(sql`${schema.users.userID} = ${id}`);

  return user;
};

export const createUser = async (
  user: Omit<InsertUser, "id" | "createdAt">
) => {

  const hashedPassword = await argon2.hash(user.password, {
    type: argon2.argon2id,
  });
  const userWithHashedPassword = { ...user, password: hashedPassword };
  const addedUser = await db
    .insert(schema.users)
    .values(userWithHashedPassword)
    .returning();

    // règle ts pour vérif tableau
  return addedUser[0];
};

export const authUser = async (user: Omit<InsertUser, "id" | "createdAt">) => {

  const isUserAccount = await db
    .select()
    .from(schema.users)
    .where(sql`${schema.users.email} = ${user.email}`);

  return isUserAccount.length === 0 ? undefined : isUserAccount[0];
};

// SESSION
export const createSession = async (session: Omit<InsertSession, "id">) => {
  const addedSession = await db
    .insert(schema.sessions)
    .values(session)
    .returning();

  return addedSession[0];
};

export const getSessionByToken = async (token: string) => {
  const session = await db
    .select()
    .from(schema.sessions)
    .where(sql`${schema.sessions.token} = ${token}`);

  return session.length === 0 ? undefined : session[0];
};

export const deleteSession = async (token: string) => {
  await db.delete(schema.sessions).where(sql`${schema.sessions.token} = ${token}`);
};

export const getSessions = async () => {
  return await db.select().from(schema.sessions);
};

export const deleteSessionByUserID = async (userID: number) => {
  await db.delete(schema.sessions).where(sql`${schema.sessions.userID} = ${userID}`);
};

// Characters
export const getCharacters = async () => {
  return await db.select().from(schema.characters);
};

export const addCharacter = async (character: InsertCharacter) => {
  return await db.insert(schema.characters).values(character).returning();
};

export const deleteCharacter = async (characterID: number) => {
  await db.delete(schema.characters).where(sql`${schema.characters.characterID} = ${characterID}`);
};

export const updateCharacter = async (characterID: number, data: Partial<InsertCharacter>) => {
  return await db.update(schema.characters).set(data).where(sql`${schema.characters.characterID} = ${characterID}`).returning();
};

// Combos
export const getCombos = async () => {
  return await db.select().from(schema.combos);
};

export const getCombosByCharacter = async (characterID: number) => {
  return await db.select().from(schema.combos).where(sql`${schema.combos.characterID} = ${characterID}`);
};

export const getCombosByUser = async (userID: number) => {
  return await db.select().from(schema.combos).where(sql`${schema.combos.userID} = ${userID}`);
};

export const addCombo = async (combo: Omit<InsertCombo, "userID">, userID: number) => {
  return await db.insert(schema.combos).values({ ...combo, userID }).returning();
};

export const deleteCombo = async (comboID: number, userID: number) => {
  await db.delete(schema.combos).where(sql`${schema.combos.comboID} = ${comboID} AND ${schema.combos.userID} = ${userID}`);
};

// Inputs
export const getInputs = async () => {
  return await db.select().from(schema.inputs);
};

export const addInput = async (input: InsertInput) => {
  return await db.insert(schema.inputs).values(input).returning();
};

export const deleteInput = async (inputsID: string) => {
  await db.delete(schema.inputs).where(sql`${schema.inputs.inputsID} = ${inputsID}`);
};

export const updateInput = async (inputsID: string, data: Partial<InsertInput>) => {
  return await db.update(schema.inputs).set(data).where(sql`${schema.inputs.inputsID} = ${inputsID}`).returning();
};