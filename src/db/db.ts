import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";



dotenv.config();

const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "rardooba",
  password: "rar",
  database: "combodb",
});

export const db = drizzle(pool);