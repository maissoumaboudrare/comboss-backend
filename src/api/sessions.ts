import { Hono } from "hono";
import * as model from "../models";

const sessions = new Hono();

sessions.get("/", async (c) => {
  try {
    const allSessions = await model.getSessions();
    return c.json(allSessions, 200);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    return c.json({ message: "Error fetching sessions" }, 500);
  }
});

sessions.delete("/:userID", async (c) => {
  try {
    const userID = parseInt(c.req.param("userID"), 10);
    if (isNaN(userID)) {
      return c.json({ message: "Invalid user ID" }, 400);
    }
    await model.deleteSessionByUserID(userID);
    return c.json({ message: "Session deleted" }, 200);
  } catch (err) {
    console.error("Error deleting session:", err);
    return c.json({ message: "Error deleting session" }, 500);
  }
});

export default sessions;