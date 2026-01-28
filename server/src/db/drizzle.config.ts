import { defineConfig } from "drizzle-kit";
import { CONFIG } from "src/config/configuration";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: CONFIG.DATABASE_URL,
  },
  casing: "snake_case",
});
