import { Hono } from "hono";
import * as model from "../models";
import { getCookie } from "hono/cookie";

const combos = new Hono();

combos.get("/", async (c) => {
  try {
    const allCombos = await model.getCombos();
    return c.json(allCombos, 200);
  } catch (err) {
    console.error("Error fetching combos:", err);
    return c.json({ message: "Error fetching combos" }, 500);
  }
});

combos.get("/character/:characterID", async (c) => {
  try {
    const characterID = parseInt(c.req.param("characterID"), 10);
    const token = getCookie(c, "session_token");
    let userID: number | undefined;

    if (token) {
      const session = await model.getSessionByToken(token);
      if (session && session.userID !== null) {
        userID = session.userID;
      }
    }

    const characterCombos = await model.getCombosByCharacter(characterID, userID);
    return c.json(characterCombos, 200);
  } catch (err) {
    console.error("Error fetching character combos:", err);
    return c.json({ message: "Error fetching character combos" }, 500);
  }
});

combos.get("/user/:userID", async (c) => {
  try {
    const userID = parseInt(c.req.param("userID"), 10);
    const userCombos = await model.getCombosByUser(userID);
    return c.json(userCombos, 200);
  } catch (err) {
    console.error("Error fetching user combos:", err);
    return c.json({ message: "Error fetching user combos" }, 500);
  }
});

combos.post("/", async (c) => {
  try {
    const token = getCookie(c, "session_token");

    if (!token) {
      return c.json({ message: "User not authenticated" }, 401);
    }

    const session = await model.getSessionByToken(token);

    if (!session || session.userID === null) {
      return c.json({ message: "Invalid session" }, 401);
    }

    const { combo, positions, inputs } = await c.req.json();

    const addedCombo = await model.addCombo({ ...combo, userID: session.userID}, positions, inputs);
    return c.json(addedCombo, 201);
  } catch (err) {
    console.error("Error adding combo:", err);
    return c.json({ message: "Error adding combo" }, 500);
  }
});

combos.delete("/:comboID", async (c) => {
  try {
    const token = getCookie(c, "session_token");
    
    if (!token) {
      return c.json({ message: "User not authenticated" }, 401);
    }

    const session = await model.getSessionByToken(token);
    if (!session || session.userID === null) {
      return c.json({ message: "Invalid session" }, 401);
    }

    const comboID = parseInt(c.req.param("comboID"), 10);
    await model.deleteCombo(comboID, session.userID);
    return c.json({ message: "Combo deleted" }, 200);
  } catch (err) {
    console.error("Error deleting combo:", err);
    return c.json({ message: "Error deleting combo" }, 500);
  }
});

export default combos;