import { Hono } from "hono";
import * as model from "../model";

const sessions = new Hono();

sessions.get("/", async (c) => {
  const allSessions = await model.getSessions();
  return c.json(allSessions, 200);
});

sessions.delete("/:userID", async (c) => {
  const userID = parseInt(c.req.param("userID"), 10);
  await model.deleteSessionByUserID(userID);
  return c.json({ message: "Session deleted" }, 200);
});

export default sessions;
