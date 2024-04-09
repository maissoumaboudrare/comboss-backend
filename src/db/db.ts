import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";

//import { users } from "./schema";

dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "test",
});

export const db = drizzle(pool);