import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

import { COOKIE_PARAM } from "../constants/cookie-param";

export const SessionId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const cookies = (request as Request).cookies as Record<string, string>;
  const sessionId = cookies[COOKIE_PARAM.sessionId];

  return sessionId;
});
