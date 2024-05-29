import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";


migrate(db, { migrationsFolder: "./src/db/migrations", migrationsSchema: './src/db/schema.ts' })
  .then(() => {
    console.log("Migrations complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migrations failed!", err);
    process.exit(1);
  });

  // ?? connection.end();