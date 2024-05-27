import { Hono } from "hono";
import * as model from "../model";
import { getCookie } from "hono/cookie";

const combos = new Hono();

combos.get("/", async (c) => {
  const allCombos = await model.getCombos();
  return c.json(allCombos, 200);
});

combos.get("/character/:characterID", async (c) => {
  const characterID = parseInt(c.req.param("characterID"), 10);
  const characterCombos = await model.getCombosByCharacter(characterID);
  return c.json(characterCombos, 200);
});

combos.get("/user/:userID", async (c) => {
  const userID = parseInt(c.req.param("userID"), 10);
  const userCombos = await model.getCombosByUser(userID);
  return c.json(userCombos, 200);
});

combos.post("/", async (c) => {
  const token = getCookie(c, "session_token");
  if (!token) {
    return c.json({ message: "User not authenticated" }, 401);
  }
  
  const session = await model.getSessionByToken(token);
  if (!session || session.userID === null) {
    return c.json({ message: "Invalid session" }, 401);
  }

  const newCombo = await c.req.json();
  const addedCombo = await model.addCombo(newCombo, session.userID);
  return c.json(addedCombo, 201);
});

combos.delete("/:comboID", async (c) => {
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
});

export default combos;
