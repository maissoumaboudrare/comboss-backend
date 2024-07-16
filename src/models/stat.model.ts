import { db } from "../db/db";
import * as schema from "../db/schema";
import { sql, eq } from "drizzle-orm";

export const getCharacterStats = async (characterID: number) => {
  const [numberOfCombos, numberOfLikes] = await Promise.all([
    db
      .select({ count: sql`COUNT(${schema.combos.comboID})` })
      .from(schema.combos)
      .where(eq(schema.combos.characterID, characterID))
      .then((result) => result[0]?.count || 0),
    db
      .select({ count: sql`COUNT(${schema.likes.likeID})` })
      .from(schema.likes)
      .innerJoin(schema.combos, eq(schema.likes.comboID, schema.combos.comboID))
      .where(eq(schema.combos.characterID, characterID))
      .then((result) => result[0]?.count || 0),
  ]);

  return { numberOfCombos, numberOfLikes };
};
