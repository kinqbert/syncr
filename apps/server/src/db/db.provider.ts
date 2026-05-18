import { Injectable, ServiceUnavailableException } from "@nestjs/common";

import { isDemo } from "../common/demo";
import { db, demoDb } from "./drizzle";

@Injectable()
export class DbProvider {
  get db() {
    if (!isDemo()) {
      return db;
    }

    if (!demoDb) {
      throw new ServiceUnavailableException("Demo database is not configured");
    }

    return demoDb;
  }
}
