import { Hono } from "hono";
import * as model from "../model";

const characters = new Hono();

characters.get("/", async (c) => {
  const allCharacters = await model.getCharacters();
  return c.json(allCharacters, 200);
});

characters.post("/", async (c) => {
  const newCharacter = await c.req.json();
  const addedCharacter = await model.addCharacter(newCharacter);
  return c.json(addedCharacter, 201);
});

characters.delete("/:characterID", async (c) => {
  const characterID = parseInt(c.req.param("characterID"), 10);
  await model.deleteCharacter(characterID);
  return c.json({ message: "Character deleted" }, 200);
});

characters.put("/:characterID", async (c) => {
  const characterID = parseInt(c.req.param("characterID"), 10);
  const updatedData = await c.req.json();
  const updatedCharacter = await model.updateCharacter(characterID, updatedData);
  return c.json(updatedCharacter, 200);
});


export default characters;
