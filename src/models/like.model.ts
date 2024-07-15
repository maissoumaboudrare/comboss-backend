import { db } from "../db/db";
import * as schema from "../db/schema";
import { InsertLike } from "../db/schema";
import { sql } from "drizzle-orm";

export const addLike = async (userID: number, comboID: number): Promise<InsertLike[]> => {
  return await db.insert(schema.likes).values({ userID, comboID }).returning()
};

export const deleteLike = async (userID: number, comboID: number): Promise<void> => {
  await db.delete(schema.likes).where(sql`${schema.likes.userID} = ${userID} AND ${schema.likes.comboID} = ${comboID}`);
};

export const getLikesByCombo = async (comboID: number) => {
  const result = await db.select({
    comboID: schema.likes.comboID,
    count: sql`COUNT(${schema.likes.likeID})`
  }).from(schema.likes)
    .where(sql`${schema.likes.comboID} = ${comboID}`)
    .groupBy(schema.likes.comboID);

  return result[0]?.count ?? 0;
};