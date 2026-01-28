/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

import { COOKIE_PARAM } from "../constants/cookie-param";
import { verifyAccessToken } from "../utils/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const cookies = (request as Request).cookies as Record<string, string>;
    const token = cookies[COOKIE_PARAM.accessToken];

    if (!token) {
      throw new UnauthorizedException("Missing token");
    }

    try {
      const payload = verifyAccessToken(token);

      request.userId = payload.userId;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
