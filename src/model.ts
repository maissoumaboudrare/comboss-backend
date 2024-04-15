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
  //if (!user && user.email && user.password) return "No user added !";

  const hashedPassword = await argon2.hash(user.password, {
    type: argon2.argon2id,
  });
  const userWithHashedPassword = { ...user, password: hashedPassword };
  const addedUser = await db
    .insert(schema.users)
    .values(userWithHashedPassword)
    .returning();
  return addedUser[0];
};

export const authUser = async (user: Omit<InsertUser, "id" | "createdAt">) => {

  //! gérer le cas de l'email non similaire. Le SQL me retourne un tableau vide au lieu d'un boolean.
  //* peut-être utiliser le eq ? 

  const isUserAccount = await db
    .select()
    .from(schema.users)
    .where(sql`${schema.users.email} = ${user.email}`);

  return isUserAccount;
};
