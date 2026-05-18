import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";

import { CONFIG } from "../config/configuration";
import * as schema from "./schema";

export type AppDb = NodePgDatabase<typeof schema>;

export const db = drizzle(CONFIG.DATABASE_URL, { schema, casing: "snake_case" });

export const demoDb = CONFIG.DEMO_DATABASE_URL
  ? drizzle(CONFIG.DEMO_DATABASE_URL, { schema, casing: "snake_case" })
  : null;

export default db;
