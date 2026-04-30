import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

import { COOKIE_PARAM } from "../constants/cookie-param";

export const AccessToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const cookies = (request as Request).cookies;
  const token = cookies[COOKIE_PARAM.accessToken];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return token;
});
