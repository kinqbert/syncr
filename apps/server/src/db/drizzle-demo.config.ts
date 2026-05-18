import { defineConfig } from "drizzle-kit";

import { CONFIG } from "../config/configuration";

if (!CONFIG.DEMO_DATABASE_URL) {
  throw new Error("DEMO_DATABASE_URL is required to migrate the demo database");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: CONFIG.DEMO_DATABASE_URL,
  },
  casing: "snake_case",
});
