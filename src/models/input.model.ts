import { db } from "../db/db";
import * as schema from "../db/schema";
import { InsertInput } from "../db/schema";
import { sql } from "drizzle-orm";

export const getInputs = async () => {
  return await db.select().from(schema.inputs);
};

export const addInput = async (input: InsertInput) => {
  return await db.insert(schema.inputs).values(input).returning();
};

export const deleteInput = async (inputID: number) => {
  await db
    .delete(schema.inputs)
    .where(sql`${schema.inputs.inputID} = ${inputID}`);
};

export const updateInput = async (
  inputID: number,
  data: Partial<InsertInput>
) => {
  return await db
    .update(schema.inputs)
    .set(data)
    .where(sql`${schema.inputs.inputID} = ${inputID}`)
    .returning();
};
