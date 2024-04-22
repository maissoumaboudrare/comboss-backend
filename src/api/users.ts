import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie'
import * as model from "../model";
import * as argon2 from "argon2";

import * as crypto from "crypto"


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

// Login & Logout
users.post("/login", async (c) => {
  const credentials = await c.req.json();
  const user = await model.authUser(credentials);
  
  if (user) {
    const isCorrectPassword = await argon2.verify(user.password, credentials.password);

    if (isCorrectPassword) {
      //! ! high severity vulnerability on UUID package
      const token: string = crypto.randomUUID();
      const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await model.createSession({ userId: user.id, token, expirationTime });

      setCookie(c, "session_token", token, { httpOnly: true, expires: expirationTime })

      return c.json({ message: "Login successful" });
    }
  }

  return c.json({ message: "Invalid credentials" }, 401);
});

users.post("/logout", async (c) => {
  const token = getCookie(c, "session_token");
  
  if (token) {
    await model.deleteSession(token);
    deleteCookie(c, "session_token");
  }

  return c.json({ message: "Logout successful" });
});

app.route("/api/users", users);

app.get("/api/*", (c) => c.text("API endpoint is not found", 404));

const port = 3000;

serve({
  fetch: app.fetch,
  port,
});

