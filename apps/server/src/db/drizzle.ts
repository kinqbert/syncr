import { drizzle } from "drizzle-orm/node-postgres";
import { CONFIG } from "src/config/configuration";

import * as schema from "./schema";

const db = drizzle(CONFIG.DATABASE_URL, { schema, casing: "snake_case" });

export default db;
