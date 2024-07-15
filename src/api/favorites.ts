import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import * as model from "../models";

const favorites = new Hono();

favorites.post("/:comboID", async (c) => {
  const comboID = parseInt(c.req.param("comboID"), 10);
  const token = getCookie(c, "session_token");

  if (!token) {
    return c.json({ message: "User not authenticated" }, 401);
  }

  const session = await model.getSessionByToken(token);

  if (!session || session.userID === null) {
    return c.json({ message: "Invalid session" }, 401);
  }

  const userID = session.userID;
  const newFavorite = await model.addFavorite(userID, comboID);

  return c.json(newFavorite, 201);
});

favorites.delete("/:comboID", async (c) => {
  const comboID = parseInt(c.req.param("comboID"), 10);
  const token = getCookie(c, "session_token");

  if (!token) {
    return c.json({ message: "User not authenticated" }, 401);
  }

  const session = await model.getSessionByToken(token);
  if (!session || session.userID === null) {
    return c.json({ message: "Invalid session" }, 401);
  }

  await model.deleteFavorite(session.userID, comboID);
  return c.json({ message: "Favorite deleted successfully" }, 200);
});

favorites.get("/user/:userID", async (c) => {
  const userID = parseInt(c.req.param("userID"), 10);
  const favorites = await model.getFavoritesByUser(userID);

  return c.json(favorites, 200);
});

export default favorites;