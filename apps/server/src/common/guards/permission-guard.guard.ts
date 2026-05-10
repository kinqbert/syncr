/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

import { RoleRepository } from "../../repositories/role.repository";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const headers = (request as Request).headers;
    const companyId = headers["X-Company-Id".toLowerCase()];
    const userId = request.userId;

    if (!companyId) {
      throw new BadRequestException("No company ID found");
    }

    if (!userId) {
      throw new BadRequestException("Invalid or expired token");
    }

    const userCompanyPermission = await this.roleRepository.getUserCompanyPermission(
      userId,
      Number(companyId),
    );

    if (!userCompanyPermission) {
      throw new BadRequestException("User does not have the required permission");
    }

    return true;
  }
}
