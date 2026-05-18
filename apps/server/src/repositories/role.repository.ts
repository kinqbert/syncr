import { Injectable } from "@nestjs/common";
import { RoleKey } from "@syncr/packages";
import { and, eq } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import { permissions, rolePermissions, roles, userCompanyRoles } from "../db/schema";
import { BaseRepository } from "./base.repository";

@Injectable()
export class RoleRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async findRoleByKey(roleKey: RoleKey) {
    const [role] = await this.db.select().from(roles).where(eq(roles.key, roleKey)).limit(1);

    return role;
  }

  async getUserCompanyPermission(userId: number, companyId: number) {
    const [permission] = await this.db
      .select()
      .from(userCompanyRoles)
      .where(and(eq(userCompanyRoles.userId, userId), eq(userCompanyRoles.companyId, companyId)))
      .innerJoin(roles, eq(userCompanyRoles.roleId, roles.id))
      .innerJoin(rolePermissions, eq(userCompanyRoles.roleId, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id));

    return permission.permissions;
  }
}
