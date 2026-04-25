import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import db from "src/db/drizzle";
import { users } from "src/db/schema";

@Injectable()
export class UserRepository {
  async createUser(data: typeof users.$inferInsert) {
    await db.insert(users).values(data);
  }

  async findUserByEmail(email: string) {
    const [user] = await db
      .select({ id: users.id, password: users.password })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }
}
