import { sql } from "drizzle-orm";
import { db } from "./db/db";
import * as schema from "./db/schema";
import { InsertUser } from "./db/schema";
import * as argon2 from "argon2";

export const getUsers = async () => {
  const users = await db.select().from(schema.users);

  return users;
};

export const getUser = async (id: string) => {
  const user = await db
    .select()
    .from(schema.users)
    .where(sql`${schema.users.id} = ${id}`);

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

// trouver un moyen de prouver qui on est pour les requêtes suivantes.