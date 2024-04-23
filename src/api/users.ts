import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import * as model from "../model";
import * as argon2 from "argon2";

import * as crypto from "crypto";
import { db } from "../db/db";
import { sessions, users as userTable } from "../db/schema";
import { eq } from "drizzle-orm";

import { isValidEmail, isValidPassword } from "../utils/validation";

const app = new Hono();

const users = new Hono();
users.get("/", async (c) => {
  try {
    const users = await model.getUsers();
    return c.json(users, 200);
  } catch (err) {
    console.error("Error fetching users:", err);
    return c.json({ message: "Error fetching users" }, 500);
  }
});
users.get("/:id", async (c) => {
  const token = getCookie(c, "session_token");

  if (token) {
    const result = await db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token));

    if (result.length === 0)
      return c.json({ message: "Session not found !" }, 400);

    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, result[0].userId));

    return c.json(user, 200);
  }

  // const { id } = c.req.param();
  // const user = await model.getUser(id);
  return c.json({ message: "Cookie not found !" }, 400);
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

  //TODO : Q > seperate if ?
  if (!isValidEmail(credentials.email) || !isValidPassword(credentials.password)) {
    return c.json({ message: "Invalid credentials format" }, 400);
  }

  try {
    const user = await model.authUser(credentials);

    if (user) {
      const isCorrectPassword = await argon2.verify(
        user.password,
        credentials.password
      );

      if (isCorrectPassword) {
        const token: string = crypto.randomUUID();
        const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        await model.createSession({ userId: user.id, token, expirationTime });

        setCookie(c, "session_token", token, {
          httpOnly: true,
          expires: expirationTime,
        });

        return c.json({ message: "Login successful" });
      }
    }

    return c.json({ message: "Invalid credentials" }, 401);
  } catch (err) {
    console.error("Error during login:", err);
    return c.json({ message: "Login failed" }, 500);
  }
});

users.post("/logout", async (c) => {
  try {
    const token = getCookie(c, "session_token");

    if (token) {
      await model.deleteSession(token);
      deleteCookie(c, "session_token");
      return c.json({ message: "Logout successful" });
    }

    return c.json({ message: "Cookie not found !" });
  } catch (err) {
    console.error("Error during logout:", err);
    return c.json({ message: "Logout failed" }, 500);
  }
});

app.route("/api/users", users);

app.get("/api/*", (c) => c.text("API endpoint is not found", 404));

const port = 3000;

serve({
  fetch: app.fetch,
  port,
});
