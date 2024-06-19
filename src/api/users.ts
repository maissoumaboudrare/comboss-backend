
import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import * as model from "../model";

import * as argon2 from "argon2";
import * as crypto from "crypto";

import { db } from "../db/db";
import { sessions, users as userTable } from "../db/schema";
import { eq } from "drizzle-orm";

import { isValidEmail, isValidPassword, isValidUsername } from "../utils/validation";



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
  const { id } = c.req.param();
  try {
    const user = await model.getUser(id);
    if (user) {
      return c.json(user, 200);
    } else {
      return c.json({ message: "User not found" }, 404);
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    return c.json({ message: "Error fetching user" }, 500);
  }
});
// users.get("/:id", async (c) => {
//   const token = getCookie(c, "session_token");

//   if (token) {
//     const result = await db
//       .select()
//       .from(sessions)
//       .where(eq(sessions.token, token));

//     if (result.length === 0)
//       return c.json({ message: "Session not found !" }, 400);

//     const userID = Number(result[0].userID);
//     if (isNaN(userID)) {
//       return c.json({ message: "Invalid user ID in session" }, 400);
//     }

//     const user = await db
//       .select()
//       .from(userTable)
//       .where(eq(userTable.userID, userID));

//     return c.json(user, 200);
//   }
//   return c.json({ message: "Cookie not found !" }, 400);
// });

users.post("/", async (c) => {
  const newUser = await c.req.json();

  if (!isValidEmail(newUser.email) || !isValidPassword(newUser.password) || !isValidUsername(newUser.pseudo)) {
    return c.json({ message: "Invalid user data format" }, 400);
  }

  const addedUser = await model.createUser(newUser);

  return c.json(addedUser, 201);
});

// Login & Logout
users.post("/login", async (c) => {
  const credentials = await c.req.json();

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

        await model.createSession({ userID: user.userID, token, expirationTime });

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

export default users