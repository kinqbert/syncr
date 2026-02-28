import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import db from "src/db/drizzle";
import { userSessions } from "src/db/schema";

@Injectable()
export class AuthRepository {
  async createSession(userId: number, refreshTokenHash: string, expiresAt: Date) {
    const [session] = await db

      .insert(userSessions)

      .values({ userId, refreshTokenHash, expiresAt })

      .returning();

    return session;
  }

  async findSessionById(sessionId: string) {
    const [session] = await db

      .select()

      .from(userSessions)

      .where(eq(userSessions.id, sessionId))

      .limit(1);

    return session;
  }

  async updateRefreshTokenHash(sessionId: string, refreshTokenHash: string) {
    await db.update(userSessions).set({ refreshTokenHash }).where(eq(userSessions.id, sessionId));
  }

  async deleteSession(sessionId: string) {
    await db.delete(userSessions).where(eq(userSessions.id, sessionId));
  }
}
