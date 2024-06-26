import { db } from "../db/db";
import * as schema from "../db/schema";
import { InsertSession } from "../db/schema";
import { sql } from "drizzle-orm";

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
  await db
    .delete(schema.sessions)
    .where(sql`${schema.sessions.token} = ${token}`);
};

export const getSessions = async () => {
  return await db.select().from(schema.sessions);
};

export const deleteSessionByUserID = async (userID: number) => {
  await db
    .delete(schema.sessions)
    .where(sql`${schema.sessions.userID} = ${userID}`);
};
