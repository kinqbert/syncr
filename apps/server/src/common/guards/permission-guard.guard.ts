/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionKey } from "@syncr/packages";
import { Request } from "express";

import { RoleRepository } from "../../repositories/role.repository";
import { REQUIRED_PERMISSION_KEY } from "../decorators/require-permission.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const companyId = Number((request as Request).headers["x-company-id"]);
    const userId: number | undefined = request.userId;

    if (!Number.isInteger(companyId) || companyId <= 0) {
      throw new BadRequestException("No company ID found");
    }

    if (!userId) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const requiredPermission = this.reflector.getAllAndOverride<PermissionKey | undefined>(
      REQUIRED_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const userPermissions = await this.roleRepository.getUserCompanyPermissionKeys(
      userId,
      companyId,
    );

    if (userPermissions.length === 0) {
      throw new ForbiddenException("You are not a member of this company");
    }

    if (requiredPermission && !userPermissions.includes(requiredPermission)) {
      throw new ForbiddenException("You do not have permission to perform this action");
    }

    return true;
  }
}
