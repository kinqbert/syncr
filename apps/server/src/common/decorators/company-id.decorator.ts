import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CompanyId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const headers = (request as Request).headers;
  const companyId = headers["X-Company-Id".toLowerCase()];

  return Number(companyId);
});
