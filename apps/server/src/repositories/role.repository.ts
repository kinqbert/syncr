import { Injectable } from "@nestjs/common";
import { PermissionKey } from "@syncr/packages";
import { and, eq } from "drizzle-orm";

import db from "../db/drizzle";
import { permissions, rolePermissions, roles, userCompanyRoles } from "../db/schema";

@Injectable()
export class RoleRepository {
  async getUserCompanyPermission(userId: number, companyId: number, permissionKey: PermissionKey) {
    const [permission] = await db
      .select()
      .from(userCompanyRoles)
      .where(and(eq(userCompanyRoles.userId, userId), eq(userCompanyRoles.companyId, companyId)))
      .innerJoin(roles, eq(userCompanyRoles.roleId, roles.id))
      .innerJoin(rolePermissions, eq(userCompanyRoles.roleId, rolePermissions.roleId))
      .innerJoin(
        permissions,
        and(eq(rolePermissions.permissionId, permissions.id), eq(permissions.key, permissionKey)),
      );

    return permission.permissions;
  }
}
