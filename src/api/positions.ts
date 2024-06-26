import { Hono } from "hono";
import * as model from "../models";

const positions = new Hono();

positions.get("/", async (c) => {
  try {
    const allPositions = await model.getPositions();
    return c.json(allPositions, 200);
  } catch (err) {
    console.error("Error fetching positions:", err);
    return c.json({ message: "Error fetching positions" }, 500);
  }
});

positions.post("/", async (c) => {
  try {
    const newPosition = await c.req.json();
    const addedPosition = await model.addPosition(newPosition);
    return c.json(addedPosition, 201);
  } catch (err) {
    console.error("Error adding position:", err);
    return c.json({ message: "Error adding position" }, 500);
  }
});

positions.delete("/:positionID", async (c) => {
  try {
    const positionID = parseInt(c.req.param("positionID"), 10);
    await model.deletePosition(positionID);
    return c.json({ message: "Position deleted" }, 200);
  } catch (err) {
    console.error("Error deleting position:", err);
    return c.json({ message: "Error deleting position" }, 500);
  }
});

positions.patch("/:positionID", async (c) => {
  try {
    const positionID = parseInt(c.req.param("positionID"), 10);
    const updatedData = await c.req.json();
    const updatedPosition = await model.updatePosition(positionID, updatedData);
    return c.json(updatedPosition, 200);
  } catch (err) {
    console.error("Error updating position:", err);
    return c.json({ message: "Error updating position" }, 500);
  }
});

export default positions;