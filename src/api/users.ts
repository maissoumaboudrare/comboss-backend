import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import * as model from "../models";
import * as argon2 from "argon2";
import * as crypto from "crypto";

import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "../utils/validation";

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

users.get("/:userID", async (c) => {
  try {
    const userID = parseInt(c.req.param("userID"), 10);
    const user = await model.getUser(userID);
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

users.post("/", async (c) => {
  const newUser = await c.req.json();

  if (
    !isValidEmail(newUser.email) ||
    !isValidPassword(newUser.password) ||
    !isValidUsername(newUser.pseudo)
  ) {
    return c.json({ message: "Invalid user data format" }, 400);
  }

  const addedUser = await model.createUser(newUser);

  return c.json(addedUser, 201);
});

// Login & Logout
users.post("/login", async (c) => {
  const credentials = await c.req.json();

  if (
    !isValidEmail(credentials.email) ||
    !isValidPassword(credentials.password)
  ) {
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

        await model.createSession({
          userID: user.userID,
          token,
          expirationTime,
        });

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

users.patch("/:userID/password", async (c) => {
  const token = getCookie(c, "session_token");

  if (!token) {
    return c.json({ message: "User not authenticated" }, 401);
  }

  const session = await model.getSessionByToken(token);

  if (!session || session.userID === null) {
    return c.json({ message: "Invalid session" }, 401);
  }

  const userID = parseInt(c.req.param("userID"), 10);

  const { oldPassword, newPassword } = await c.req.json();

  if (isNaN(userID)) {
    return c.json({ message: "Invalid user ID" }, 400);
  }

  if (session.userID !== userID) {
    return c.json({ message: "Unauthorized access" }, 403);
  }

  try {
    const user = await model.getUserPassword(userID);
    if (!user) return c.json({ message: "User not found" }, 404);

    const passwordMatch = await argon2.verify(user.password, oldPassword);
    if (!passwordMatch) {
      return c.json({ message: "Old password is incorrect" }, 400);
    }

    const hashedPassword = await argon2.hash(newPassword);

    await model.updateUserPassword(userID, hashedPassword);

    return c.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    return c.json({ message: "Failed to update password" }, 500);
  }
});

users.patch("/:userID/avatar", async (c) => {
  const userID = parseInt(c.req.param("userID"), 10);
  const { avatarUrl } = await c.req.json();

  if (isNaN(userID)) {
    return c.json({ message: "Invalid user ID" }, 400);
  }

  try {
    await model.updateUserAvatar(userID, avatarUrl);
    return c.json({ message: "Avatar updated successfully" });
  } catch (err) {
    console.error("Error updating avatar:", err);
    return c.json({ message: "Failed to update avatar" }, 500);
  }
});

users.delete("/:userID", async (c) => {
  const userID = parseInt(c.req.param("userID"), 10);

  if (isNaN(userID)) {
    return c.json({ message: "Invalid user ID" }, 400);
  }

  try {
    await model.deleteUserByUserID(userID);
    return c.json({ message: "User deleted successfully" }, 200);
  } catch (err) {
    console.error("Error deleting user:", err);
    return c.json({ message: "Failed to delete user" }, 500);
  }
});

// ! return c.json({ likeCount }, 200);
// users.get("/combos/:comboID/likes", async (c) => {
//   const comboID = parseInt(c.req.param("comboID"), 10);
//   const likeCount = await model.getLikesByCombo(comboID);
//   return c.json({ likeCount });
// });

// users.get("/:userID/favorites", async (c) => {
//   const userID = parseInt(c.req.param("userID"), 10);
//   const favorites = await model.getFavoritesByUser(userID);
//   return c.json(favorites, 200);
// });

export default users;
