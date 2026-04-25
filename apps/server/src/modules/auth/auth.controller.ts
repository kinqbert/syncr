import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { COOKIE_PARAM } from "src/common/constants/cookie-param";
import { RefreshToken } from "src/common/decorators/refresh-token.decorator";
import { SessionId } from "src/common/decorators/session-id.decorator";
import { UserId } from "src/common/decorators/user-id.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { isProduction } from "src/common/utils/node-env";

import { LoginDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  private readonly cookieTTL = 1000 * 60 * 60 * 24 * 365;

  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, sessionId } = await this.authService.login(loginDto);

    this.setCookie(res, COOKIE_PARAM.accessToken, accessToken, true);
    this.setCookie(res, COOKIE_PARAM.refreshToken, refreshToken);
    this.setCookie(res, COOKIE_PARAM.sessionId, sessionId);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async getMe(@UserId() userId: number) {
    return await this.authService.getMe(userId);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @SessionId() sessionId: string,
    @RefreshToken() refreshToken: string,
  ) {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken, sessionId);

    this.setCookie(res, COOKIE_PARAM.accessToken, newAccessToken, true);
    this.setCookie(res, COOKIE_PARAM.refreshToken, newRefreshToken);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response, @SessionId() sessionId: string) {
    await this.authService.logout(sessionId);

    this.clearCookie(res, COOKIE_PARAM.accessToken);
    this.clearCookie(res, COOKIE_PARAM.refreshToken);
    this.clearCookie(res, COOKIE_PARAM.sessionId);
  }

  private setCookie(res: Response, key: COOKIE_PARAM, value: any, isSessionCookie = false) {
    res.cookie(key, value, {
      secure: isProduction(),
      httpOnly: true,
      sameSite: "lax",
      maxAge: isSessionCookie ? undefined : this.cookieTTL,
    });
  }

  private clearCookie(res: Response, key: COOKIE_PARAM) {
    res.clearCookie(key, {
      secure: isProduction(),
      httpOnly: true,
      sameSite: "lax",
    });
  }
}
