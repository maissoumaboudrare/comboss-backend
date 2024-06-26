import { db } from "../db/db";
import * as schema from "../db/schema";
import { InsertCharacter } from "../db/schema";
import { sql } from "drizzle-orm";

export const getCharacters = async () => {
  return await db.select().from(schema.characters);
};

export const getCharacterById = async (characterID: number) => {
  const characters = await db
    .select()
    .from(schema.characters)
    .where(sql`${schema.characters.characterID} = ${characterID}`);
  return characters[0] || null;
};

export const addCharacter = async (character: InsertCharacter) => {
  return await db.insert(schema.characters).values(character).returning();
};

export const deleteCharacter = async (characterID: number) => {
  await db
    .delete(schema.characters)
    .where(sql`${schema.characters.characterID} = ${characterID}`);
};

export const updateCharacter = async (
  characterID: number,
  data: Partial<InsertCharacter>
) => {
  return await db
    .update(schema.characters)
    .set(data)
    .where(sql`${schema.characters.characterID} = ${characterID}`)
    .returning();
};
