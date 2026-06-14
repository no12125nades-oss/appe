import { drizzle } from "drizzle-orm/node-postgres";
import { hashPassword } from "../api/local-auth";
import * as schema from "./schema";
import "dotenv/config";

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const db = drizzle(dbUrl, { schema });

  // Create admin user
  const adminPassword = await hashPassword("admin");

  await db
    .insert(schema.users)
    .values({
      email: "admin@admin.com",
      passwordHash: adminPassword,
      name: "Administrator",
      role: "admin",
    })
    .onConflictDoNothing();

  console.log("Seed complete: Admin user created (admin@admin.com / admin)");
}

seed().catch(console.error);
