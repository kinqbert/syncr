import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import db from "../db/drizzle";
import { users } from "../db/schema";

@Injectable()
export class UserRepository {
  async createUser(data: typeof users.$inferInsert) {
    const [user] = await db.insert(users).values(data).returning();

    return user;
  }

  async findUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    return user;
  }

  async findUserById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

    return user;
  }
}
