import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

// ! review migration concept

migrate(db, {
  migrationsFolder: "./src/db/migrations",
  migrationsTable: "combosss_migrations",
  migrationsSchema: "combosss_schema",
})
  .then(() => {
    console.log("Migrations complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migrations failed!", err);
    process.exit(1);
  });

// ?? connection.end();
