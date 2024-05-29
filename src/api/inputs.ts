import { Hono } from "hono";
import * as model from "../model";

const inputs = new Hono();

inputs.get("/", async (c) => {
  try {
    const allInputs = await model.getInputs();
    return c.json(allInputs, 200);
  } catch (err) {
    console.error("Error fetching inputs:", err);
    return c.json({ message: "Error fetching inputs" }, 500);
  }
});

inputs.post("/", async (c) => {
  try {
    const newInput = await c.req.json();
    const addedInput = await model.addInput(newInput);
    return c.json(addedInput, 201);
  } catch (err) {
    console.error("Error adding input:", err);
    return c.json({ message: "Error adding input" }, 500);
  }
});

inputs.delete("/:inputsID", async (c) => {
  try {
    const inputsID = c.req.param("inputsID");
    await model.deleteInput(inputsID);
    return c.json({ message: "Input deleted" }, 200);
  } catch (err) {
    console.error("Error deleting input:", err);
    return c.json({ message: "Error deleting input" }, 500);
  }
});

inputs.patch("/:inputsID", async (c) => {
  try {
    const inputsID = c.req.param("inputsID");
    const updatedData = await c.req.json();
    const updatedInput = await model.updateInput(inputsID, updatedData);
    return c.json(updatedInput, 200);
  } catch (err) {
    console.error("Error updating input:", err);
    return c.json({ message: "Error updating input" }, 500);
  }
});

export default inputs;