import { db } from "../db/db";
import * as schema from "../db/schema";
import { InsertCombo } from "../db/schema";
import { sql, eq, inArray } from "drizzle-orm";
import { addPosition } from "./position.model";

export const getCombos = async () => {
  return await db.select().from(schema.combos);
};

export const getCombosByCharacter = async (characterID: number) => {

  const getCombosOfCharacter = await db
    .select({
      comboID: schema.combos.comboID,
      comboName: schema.combos.comboName,
      userID: schema.combos.userID,
    })
    .from(schema.combos)
    .where(eq(schema.combos.characterID, characterID));

  const extractComboIDs = getCombosOfCharacter.map((combo) => combo.comboID);

  const getPositionsOfCombos = await Promise.all(
    extractComboIDs.map((comboID) =>
      db
        .select({
          positionName: schema.positions.positionName,
        })
        .from(schema.comboPositions)
        .innerJoin(
          schema.positions,
          eq(schema.comboPositions.positionID, schema.positions.positionID)
        )
        .where(eq(schema.comboPositions.comboID, comboID))
    )
  );

  const getInputsOfCombos = await Promise.all(
    extractComboIDs.map((comboID) =>
      db
        .select({
          inputName: schema.inputs.inputName,
          inputSrc: schema.inputs.inputSrc,
          lineOrder: schema.comboInputs.lineOrder,
          inputOrder: schema.comboInputs.inputOrder,
        })
        .from(schema.comboInputs)
        .innerJoin(
          schema.inputs,
          eq(schema.comboInputs.inputID, schema.inputs.inputID)
        )
        .where(eq(schema.comboInputs.comboID, comboID))
    )
  );

  const getUserIDsOfCombos = getCombosOfCharacter
    .map((combo) => combo.userID)
    .filter((userID) => userID !== null) as number[];
  const users = await db
    .select({
      userID: schema.users.userID,
      pseudo: schema.users.pseudo,
    })
    .from(schema.users)
    .where(inArray(schema.users.userID, getUserIDsOfCombos));

  const combineResults = getCombosOfCharacter.map((combo, index) => ({
    comboID: combo.comboID,
    comboName: combo.comboName,
    positions: getPositionsOfCombos[index].map((pos) => pos.positionName),
    inputs: getInputsOfCombos[index],
    username: users.find((user) => user.userID === combo.userID)?.pseudo,
  }));

  return combineResults
};

export const getCombosByUser = async (userID: number) => {

  const getCombosOfUser = await db
    .select({
      comboID: schema.combos.comboID,
      comboName: schema.combos.comboName,
      characterID: schema.combos.characterID,
    })
    .from(schema.combos)
    .where(eq(schema.combos.userID, userID));

  const extractComboIDs = getCombosOfUser.map((combo) => combo.comboID);

  const getPositionsOfCombos = await Promise.all(
    extractComboIDs.map((comboID) =>
      db
        .select({
          positionName: schema.positions.positionName,
        })
        .from(schema.comboPositions)
        .innerJoin(
          schema.positions,
          eq(schema.comboPositions.positionID, schema.positions.positionID)
        )
        .where(eq(schema.comboPositions.comboID, comboID))
    )
  );

  const getInputsOfCombos = await Promise.all(
    extractComboIDs.map((comboID) =>
      db
        .select({
          inputName: schema.inputs.inputName,
          inputSrc: schema.inputs.inputSrc,
          lineOrder: schema.comboInputs.lineOrder,
          inputOrder: schema.comboInputs.inputOrder,
        })
        .from(schema.comboInputs)
        .innerJoin(
          schema.inputs,
          eq(schema.comboInputs.inputID, schema.inputs.inputID)
        )
        .where(eq(schema.comboInputs.comboID, comboID))
    )
  );

  const getCharacterIDsOfCombos = getCombosOfUser
    .map((combo) => combo.characterID)
    .filter((userID) => userID !== null) as number[];
  const characters = await db
    .select({
      characterID: schema.characters.characterID,
      name: schema.characters.name,
    })
    .from(schema.characters)
    .where(inArray(schema.characters.characterID, getCharacterIDsOfCombos));

  const combineResults = getCombosOfUser.map((combo, index) => ({
    comboID: combo.comboID,
    comboName: combo.comboName,
    positions: getPositionsOfCombos[index].map((pos) => pos.positionName),
    inputs: getInputsOfCombos[index],
    characterName: characters.find((character) => character.characterID === combo.characterID)?.name,
  }));

  return combineResults
};

// Update addCombo function
export const addCombo = async (
  combo: Omit<InsertCombo, "comboID">,
  positions: { positionName: string }[],
  inputs: { inputName: string; inputSrc: string }[][]
) => {
  const addedCombo = await db.insert(schema.combos).values(combo).returning();

  const comboID = addedCombo[0].comboID;

  for (const position of positions) {
    let positionID: number;

    const existingPosition = await db
      .select({ positionID: schema.positions.positionID })
      .from(schema.positions)
      .where(sql`${schema.positions.positionName} = ${position.positionName}`)
      .limit(1);

    if (existingPosition.length > 0) {
      positionID = existingPosition[0].positionID;
    } else {
      throw new Error("Position name does not exist!")
    }
    

    await addComboPosition(comboID, positionID);
  }

  // Add inputs to combo_inputs
  for (const [lineOrder, lineInputs] of inputs.entries()) {
    for (const [inputOrder, input] of lineInputs.entries()) {
      let inputID: number;

      const existingInput = await db
        .select({ inputID: schema.inputs.inputID })
        .from(schema.inputs)
        .where(
          sql`${schema.inputs.inputName} = ${input.inputName} AND ${schema.inputs.inputSrc} = ${input.inputSrc}`
        )
        .limit(1);

      if (existingInput.length > 0) {
        inputID = existingInput[0].inputID;
      } else {
        throw new Error("Input does not exist!");
      }

      await db.insert(schema.comboInputs).values({
        comboID,
        inputID,
        lineOrder,
        inputOrder,
      });
    }
  }

  return addedCombo[0];
};

export const deleteCombo = async (comboID: number, userID: number) => {
  await db
    .delete(schema.comboInputs)
    .where(sql`${schema.comboInputs.comboID} = ${comboID}`);
  await db
    .delete(schema.combos)
    .where(
      sql`${schema.combos.comboID} = ${comboID} AND ${schema.combos.userID} = ${userID}`
    );
};

export const addComboPosition = async (comboID: number, positionID: number) => {
  return await db
    .insert(schema.comboPositions)
    .values({ comboID, positionID })
    .returning();
};
