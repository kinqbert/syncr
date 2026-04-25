import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import db from "src/db/drizzle";
import { users } from "src/db/schema";

@Injectable()
export class UserRepository {
  async countByEmail(email: string) {
    return db.$count(users, eq(users.email, email));
  }

  async createUser(data: typeof users.$inferInsert) {
    await db.insert(users).values(data);
  }

  async findAuthUserByEmail(email: string) {
    const [user] = await db
      .select({ id: users.id, password: users.password })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }
}
