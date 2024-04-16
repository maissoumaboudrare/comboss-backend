import { serve } from "@hono/node-server";
import { Hono } from "hono";
import * as model from "../model";
import * as argon2 from "argon2";

const app = new Hono();

const users = new Hono();
users.get("/", async (c) => {
  const users = await model.getUsers();
  return c.json(users, 200);
});
users.get("/:id", async (c) => {
  const { id } = c.req.param();
  const user = await model.getUser(id);
  return c.json(user, 200);
});
users.post("/", async (c) => {
  const newUser = await c.req.json();
  const addedUser = await model.createUser(newUser);
  return c.json(addedUser, 201);
});
users.post("/auth", async (c) => {
  const credentials = await c.req.json();
  const isUserAccount = await model.authUser(credentials);
  
  if (isUserAccount) {
    
    const isCorrectPassword = await argon2.verify(
      isUserAccount[0].password,
      credentials.password
    );
    return c.json(isCorrectPassword ? "Correct 👌" : "Incorrect ✋");
  }
  
  return c.json("User not found !");
});
app.route("/api/users", users);

app.get("/api/*", (c) => c.text("API endpoint is not found", 404));

// app.post('/users', async (c) => {
//   const data = await c.req.json()
//   console.log(data)
//   return c.json(data)
// })

const port = 3000;

serve({
  fetch: app.fetch,
  port,
});
