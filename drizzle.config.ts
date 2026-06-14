import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.MYSQL_URL;
if (!connectionString) {
  throw new Error("MYSQL_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
