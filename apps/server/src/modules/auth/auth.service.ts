import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { sha256 } from "js-sha256";
import { TokenPayload } from "src/common/types/token";
import { generateAccessToken, generateRefreshToken } from "src/common/utils/jwt";
import db from "src/db/drizzle";
import { users, userSessions } from "src/db/schema";

import { LoginDto, RegisterDto } from "./auth.dto";

@Injectable()
export class AuthService {
  private readonly SALT_ROUNS = 10;

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const emailDuplicateUsersAmount = await db.$count(users, eq(users.email, email));

    if (emailDuplicateUsersAmount > 0) {
      throw new ConflictException("User with such email already exists.");
    }

    const hashedPassword = await this.hashPassword(password);

    await db.insert(users).values({ email, password: hashedPassword });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const error = new NotFoundException("Wrong email or password.");

    const [existingUser] = await db
      .select({ id: users.id, password: users.password })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      throw error;
    }

    const isPasswordMatch = await this.comparePassword(password, existingUser.password);

    if (!isPasswordMatch) {
      throw error;
    }

    const userId = existingUser.id;

    const tokenPayload = { userId };

    const { accessToken, refreshToken } = this.generateTokens(tokenPayload);
    const sessionId = await this.createSessionForUser(userId, refreshToken);

    return { accessToken, refreshToken, sessionId };
  }

  async refreshTokens(refreshToken: string, sessionId: string) {
    const error = new UnauthorizedException("Refresh token expired.");

    const userSession = await this.getSessionById(sessionId);

    if (!userSession) {
      throw error;
    }

    const hashedRefreshToken = this.hashRefreshToken(refreshToken);
    const hashesMatch = userSession.refreshTokenHash === hashedRefreshToken;
    const isExpired = new Date() > new Date(userSession.expiresAt);

    if (!hashesMatch || isExpired) {
      throw error;
    }

    const tokenPayload: TokenPayload = { userId: userSession.userId };

    const newTokens = this.generateTokens(tokenPayload);

    await this.updateRefreshTokenForSession(userSession.id, newTokens.refreshToken);

    return newTokens;
  }

  async logout(sessionId: string) {
    await this.deleteSession(sessionId);
  }

  // HELPERS
  private generateTokens(payload: TokenPayload) {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  private async createSessionForUser(userId: number, refreshToken: string) {
    const refreshTokenHash = sha256(refreshToken);

    const now = new Date();
    const expiresAt = new Date(now.setDate(now.getDate() + 7));

    const [session] = await db
      .insert(userSessions)
      .values({ userId, refreshTokenHash, expiresAt })
      .returning();

    return session.id;
  }

  private async getSessionById(sessionId: string) {
    const [userSession] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, sessionId))
      .limit(1);

    return userSession;
  }

  private async deleteSession(sessionId: string) {
    await db.delete(userSessions).where(eq(userSessions.id, sessionId));
  }

  private async updateRefreshTokenForSession(sessionId: string, refreshToken: string) {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    await db.update(userSessions).set({ refreshTokenHash }).where(eq(userSessions.id, sessionId));
  }

  private hashRefreshToken(refreshToken: string) {
    return sha256(refreshToken);
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNS);
  }

  private async comparePassword(inputPassword: string, hashedPassword: string) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
}
