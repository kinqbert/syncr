import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import bcrypt from "bcrypt";

import { TokenPayload } from "../../common/types/token";
import { hash } from "../../common/utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt";
import { AuthRepository } from "../../repositories/auth.repository";
import { UserRepository } from "../../repositories/user.repository";
import { LoginDto, RegisterDto } from "./auth.dto";
import { mapMeResponseDto } from "./auth.mapper";

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly userRepository: UserRepository,

    private readonly authRepository: AuthRepository,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, surname } = registerDto;

    const emailDuplicateUser = await this.userRepository.findUserByEmail(email);

    if (emailDuplicateUser) {
      throw new ConflictException("User with such email already exists");
    }

    const hashedPassword = await this.hashPassword(password);

    await this.userRepository.createUser({
      email,
      password: hashedPassword,
      name,
      surname,
    });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const error = new NotFoundException("Wrong email or password");

    const existingUser = await this.userRepository.findUserByEmail(email);

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

  async getMe(userId: number) {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return mapMeResponseDto(user);
  }

  async refreshTokens(refreshToken: string, sessionId: string) {
    const error = new UnauthorizedException("Refresh token expired");

    try {
      verifyRefreshToken(refreshToken);
    } catch {
      throw error;
    }

    const userSession = await this.authRepository.findSessionById(sessionId);

    if (!userSession) {
      throw error;
    }

    const hashedRefreshToken = this.hashRefreshToken(refreshToken);

    const hashesMatch = userSession.refreshTokenHash === hashedRefreshToken;

    const isSessionExpired = new Date() > new Date(userSession.expiresAt);

    if (!hashesMatch || isSessionExpired) {
      throw error;
    }

    const tokenPayload: TokenPayload = { userId: userSession.userId };

    const newTokens = this.generateTokens(tokenPayload);

    await this.updateRefreshTokenForSession(userSession.id, newTokens.refreshToken);

    return newTokens;
  }

  async logout(sessionId: string) {
    await this.authRepository.deleteSession(sessionId);
  }

  // HELPERS

  private generateTokens(payload: TokenPayload) {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  private async createSessionForUser(userId: number, refreshToken: string) {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    const now = new Date();
    const expiresAt = new Date(now.setDate(now.getDate() + 7));

    const session = await this.authRepository.createSession(userId, refreshTokenHash, expiresAt);

    return session.id;
  }

  private async updateRefreshTokenForSession(sessionId: string, refreshToken: string) {
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    await this.authRepository.updateRefreshTokenHash(sessionId, refreshTokenHash);
  }

  private hashRefreshToken(refreshToken: string) {
    return hash(refreshToken);
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private async comparePassword(inputPassword: string, hashedPassword: string) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
}
