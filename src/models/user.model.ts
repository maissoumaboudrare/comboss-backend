import { db } from "../db/db";
import * as schema from "../db/schema";
import { InsertUser } from "../db/schema";
import { sql } from "drizzle-orm";
import * as argon2 from "argon2";

type UserSummary = { userID: number; pseudo: string; email: string };

export const getUsers = async (): Promise<UserSummary[]> => {
  const users = await db
    .select({
      userID: schema.users.userID,
      pseudo: schema.users.pseudo,
      email: schema.users.email,
    })
    .from(schema.users);

  return users;
};

export const getUser = async (userID: number): Promise<UserSummary | null> => {
  const user = await db
    .select({
      userID: schema.users.userID,
      pseudo: schema.users.pseudo,
      email: schema.users.email,
    })
    .from(schema.users)
    .where(sql`${schema.users.userID} = ${userID}`)
    .limit(1);

  return user.length > 0 ? user[0] : null;
};

export const createUser = async (
  user: Omit<InsertUser, "id" | "createdAt">
): Promise<UserSummary> => {
  const hashedPassword = await argon2.hash(user.password, {
    type: argon2.argon2id,
  });
  const userWithHashedPassword = { ...user, password: hashedPassword };
  const addedUser = await db
    .insert(schema.users)
    .values(userWithHashedPassword)
    .returning();

  if (
    !Array.isArray(addedUser) ||
    addedUser.length === 0 ||
    typeof addedUser[0].userID !== "number"
  ) {
    throw new Error("Failed to insert user or invalid return value");
  }

  const { userID, pseudo, email } = addedUser[0];
  return { userID, pseudo, email };
};

export const authUser = async (user: Omit<InsertUser, "id" | "createdAt">) => {
  const isUserAccount = await db
    .select()
    .from(schema.users)
    .where(sql`${schema.users.email} = ${user.email}`);

  return isUserAccount.length === 0 ? undefined : isUserAccount[0];
};
