import { Injectable } from "@nestjs/common";
import { User } from "@syncr/packages";
import { eq } from "drizzle-orm";
import db from "src/db/drizzle";
import { users } from "src/db/schema";

@Injectable()
export class UserRepository {
  async createUser(data: typeof users.$inferInsert): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    return user;
  }

  async findUserById(id: number): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

    return user;
  }
}
