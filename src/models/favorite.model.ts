import { db } from "../db/db";
import * as schema from "../db/schema";
import { InsertFavorite } from "../db/schema";
import { sql } from "drizzle-orm";

export const addFavorite = async (userID: number, comboID: number): Promise<InsertFavorite[]> => {
  return await db.insert(schema.favorites).values({ userID, comboID }).returning();
};

export const deleteFavorite = async (userID: number, comboID: number): Promise<void> => {
  await db.delete(schema.favorites).where(sql`${schema.favorites.userID} = ${userID} AND ${schema.favorites.comboID} = ${comboID}`);
};

export const getFavoritesByUser = async (userID: number) => {
  return await db.select().from(schema.favorites).where(sql`${schema.favorites.userID} = ${userID}`);
};