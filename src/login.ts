import * as argon2 from 'argon2';
import { db } from "./db/db";
import * as schema from "./db/schema";
import { sql, exists } from 'drizzle-orm';

const simulateUserInput = async () => {


  const userLogin = {
    email: "nandass@gmail.com",
    password: "micheletjackydehongkong"
  }

  const user = await db.select().from(schema.users).where(sql`${schema.users.email} = ${userLogin.email}`);

  try {
    if (user) {
      const isCorrectPassword = await argon2.verify(user[0].password, userLogin.password);
      console.log(`Password is ${isCorrectPassword ? "Correct 👌" : "Incorrect ✋"}`);
    }
  } catch(err) {
    console.log("User not found !");
  }
  
  // if (user) {
  //   const isCorrectPassword = await argon2.verify(user[0].password, userLogin.password);
  //   console.log(`Password is ${isCorrectPassword ? "Correct 👌" : "Incorrect ✋"}`);
  // } else {
  //   console.log("User not found !");
  // }
};

simulateUserInput();