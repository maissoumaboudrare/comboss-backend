import { Hono } from "hono";
import * as model from "../model";

const inputs = new Hono();

inputs.get("/", async (c) => {
  const allInputs = await model.getInputs();
  return c.json(allInputs, 200);
});

// ??
inputs.post("/", async (c) => {
  const newInput = await c.req.json();
  const addedInput = await model.addInput(newInput);
  return c.json(addedInput, 201);
});

inputs.delete("/:inputsID", async (c) => {
  const inputsID = c.req.param("inputsID");
  await model.deleteInput(inputsID);
  return c.json({ message: "Input deleted" }, 200);
});

inputs.put("/:inputsID", async (c) => {
  const inputsID = c.req.param("inputsID");
  const updatedData = await c.req.json();
  const updatedInput = await model.updateInput(inputsID, updatedData);
  return c.json(updatedInput, 200);
});

export default inputs;
