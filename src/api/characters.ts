import { Hono } from "hono";
import * as model from "../models";

const characters = new Hono();

characters.get("/", async (c) => {
  try {
    const allCharacters = await model.getCharacters();
    return c.json(allCharacters, 200);
  } catch (err) {
    console.error("Error fetching characters:", err);
    return c.json({ message: "Error fetching characters" }, 500);
  }
});

characters.get("/:characterID", async (c) => {
  try {
    const characterID = parseInt(c.req.param("characterID"), 10);
    const character = await model.getCharacterById(characterID);
    if (!character) {
      return c.json({ message: "Character not found" }, 404);
    }
    return c.json(character, 200);
  } catch (err) {
    console.error("Error fetching character:", err);
    return c.json({ message: "Error fetching character" }, 500);
  }
});

characters.post("/", async (c) => {
  try {
    const newCharacter = await c.req.json();
    const addedCharacter = await model.addCharacter(newCharacter);
    return c.json(addedCharacter, 201);
  } catch (err) {
    console.error("Error adding character:", err);
    return c.json({ message: "Error adding character" }, 500);
  }
});

characters.delete("/:characterID", async (c) => {
  try {
    const characterID = parseInt(c.req.param("characterID"), 10);
    await model.deleteCharacter(characterID);
    return c.json({ message: "Character deleted" }, 200);
  } catch (err) {
    console.error("Error deleting character:", err);
    return c.json({ message: "Error deleting character" }, 500);
  }
});

characters.patch("/:characterID", async (c) => {
  try {
    const characterID = parseInt(c.req.param("characterID"), 10);
    const updatedData = await c.req.json();
    const updatedCharacter = await model.updateCharacter(characterID, updatedData);
    return c.json(updatedCharacter, 200);
  } catch (err) {
    console.error("Error updating character:", err);
    return c.json({ message: "Error updating character" }, 500);
  }
});

export default characters;