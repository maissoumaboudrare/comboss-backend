import * as argon2 from 'argon2';
import { db } from "./db/db";
import * as schema from "./db/schema";
import { sql } from 'drizzle-orm';

const simulateUserInput = async () => {

  const email = "nanda@gmail.com";
  const password = "mpassword";

  const user = await db.select().from(schema.users).where(sql`${schema.users.email} = ${email}`);
  
  if (user) {
    const isCorrectPassword = await argon2.verify(user[0].password, password);
    console.log(`Password is ${isCorrectPassword ? "Correct 👌" : "Incorrect ✋"}`);
  } else {
    console.log("User not found !");
  }
};

simulateUserInput();