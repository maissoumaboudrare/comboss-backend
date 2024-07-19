import { db } from "../db/db";
import * as schema from "../db/schema";
import { InsertSession } from "../db/schema";
import { sql } from "drizzle-orm";

export const createSession = async (session: Omit<InsertSession, "sessionsID">) => {
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

export const getUserByEmail = async (email: string) => {
  const user = await db
    .select()
    .from(schema.users)
    .where(sql`${schema.users.email} = ${email}`);
  return user.length === 0 ? undefined : user[0];
};

export const createUser = async (
  pseudo: string, email: string, avatar: string
) => {
  const result = await db
    .insert(schema.users)
    .values({ pseudo, email, avatar, password: '' })
    .returning();
  return result[0];
};