import { db } from "../db/db";
import * as schema from "../db/schema";
import { positions } from "../db/schema";
import { InsertPosition } from "../db/schema";
import { sql, InferInsertModel } from "drizzle-orm";

export const getPositions = async () => {
  return await db.select().from(schema.positions);
};

export const addPosition = async (position: InsertPosition) => {
  return await db.insert(positions).values(position).returning();
};

export const deletePosition = async (positionID: number) => {
  await db
    .delete(positions)
    .where(sql`${positions.positionID} = ${positionID}`);
};

export const updatePosition = async (
  positionID: number,
  data: Partial<InferInsertModel<typeof positions>>
) => {
  return await db
    .update(positions)
    .set(data)
    .where(sql`${positions.positionID} = ${positionID}`)
    .returning();
};
