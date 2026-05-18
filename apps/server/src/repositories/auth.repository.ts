import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import { users, userSessions } from "../db/schema";
import { BaseRepository } from "./base.repository";

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async findUserByEmail(email: string) {
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    return user;
  }

  async createSession(userId: number, refreshTokenHash: string, expiresAt: Date) {
    const [session] = await this.db
      .insert(userSessions)
      .values({ userId, refreshTokenHash, expiresAt })
      .returning();

    return session;
  }

  async findSessionById(sessionId: string) {
    const [session] = await this.db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, sessionId))
      .limit(1);

    return session;
  }

  async updateRefreshTokenHash(sessionId: string, refreshTokenHash: string) {
    await this.db
      .update(userSessions)
      .set({ refreshTokenHash })
      .where(eq(userSessions.id, sessionId));
  }

  async deleteSession(sessionId: string) {
    await this.db.delete(userSessions).where(eq(userSessions.id, sessionId));
  }
}
