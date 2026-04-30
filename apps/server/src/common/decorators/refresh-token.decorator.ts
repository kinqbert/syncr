import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

import { COOKIE_PARAM } from "../constants/cookie-param";

export const RefreshToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const cookies = (request as Request).cookies;
  const token = cookies[COOKIE_PARAM.refreshToken];

  return token as string;
});
