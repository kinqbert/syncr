/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

import { AuthRepository } from "../../repositories/auth.repository";
import { COOKIE_PARAM } from "../constants/cookie-param";
import { DEMO_USER_EMAIL, isDemoRequest } from "../demo";
import { verifyAccessToken } from "../utils/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authRepository: AuthRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (isDemoRequest(request)) {
      const demoUser = await this.authRepository.findUserByEmail(DEMO_USER_EMAIL);

      if (!demoUser) {
        throw new UnauthorizedException("Demo user is not seeded");
      }

      request.userId = demoUser.id;
      return true;
    }

    const cookies = (request as Request).cookies;
    const accessToken = cookies[COOKIE_PARAM.accessToken];
    const sessionId = cookies[COOKIE_PARAM.sessionId];

    if (!accessToken) {
      throw new UnauthorizedException("Missing token");
    }

    try {
      const payload = verifyAccessToken(accessToken);

      const userSession = await this.authRepository.findSessionById(sessionId);

      if (!userSession || new Date(userSession.expiresAt) < new Date()) {
        throw new UnauthorizedException("Invalid or expired token");
      }

      request.userId = payload.userId;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
