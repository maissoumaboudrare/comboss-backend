import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import * as model from "../models";

const likes = new Hono();

likes.post("/:comboID", async (c) => {
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
  const newLike = await model.addLike(userID, comboID);

  return c.json(newLike, 201);
});

likes.delete("/:comboID", async (c) => {
  const comboID = parseInt(c.req.param("comboID"), 10);
  const token = getCookie(c, "session_token");

  if (!token) {
    return c.json({ message: "User not authenticated" }, 401);
  }

  const session = await model.getSessionByToken(token);
  if (!session || session.userID === null) {
    return c.json({ message: "Invalid session" }, 401);
  }

  await model.deleteLike(session.userID, comboID);
  return c.json({ message: "Like deleted successfully" }, 200);
});

likes.get("/combo/:comboID", async (c) => {
  const comboID = parseInt(c.req.param("comboID"), 10);
  const likeCount = await model.getLikesByCombo(comboID);

  return c.json({ likeCount }, 200);
});

export default likes;