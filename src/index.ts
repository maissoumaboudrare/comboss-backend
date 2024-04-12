import * as argon2 from 'argon2';
import { db } from "./db/db";
import * as schema from "./db/schema";

 import { InsertUser } from "./db/schema";



async function createUser(user: Omit<InsertUser, "id" | "createdAt">) {

  const hashedPassword = await argon2.hash(user.password, { type: argon2.argon2id });

  const userWithHashedPassword = { ...user, password: hashedPassword };

  const response = await db.insert(schema.users).values(userWithHashedPassword).returning();

  return response[0].id;
}

const main = async () => {
  const usersToAdd = [
    { pseudo: "Nanda", email: "nanda@gmail.com", password: "micheletjackydehongkong", isMember: true },
  ];

  for (const user of usersToAdd) {
    const id = await createUser(user);
    console.log(`Created user with id ${id}`);
  }

  const users = await db.select().from(schema.users);
  console.log(users);

  process.exit(0);
};

main();

//TODO : 
/*
1. connect user with http request (no with hard code)
2. verif user data before sending data : email, password, pseudo
*/

