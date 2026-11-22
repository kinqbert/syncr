import { Injectable } from "@nestjs/common";
import { RoleKey } from "@syncr/packages";
import { and, eq } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import {
  permissions,
  projects,
  projectUsers,
  rolePermissions,
  roles,
  userCompanyRoles,
} from "../db/schema";
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

  async getUserCompanyPermissionKeys(userId: number, companyId: number) {
    const rows = await this.db
      .select({ key: permissions.key })
      .from(userCompanyRoles)
      .where(and(eq(userCompanyRoles.userId, userId), eq(userCompanyRoles.companyId, companyId)))
      .innerJoin(rolePermissions, eq(userCompanyRoles.roleId, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id));

    return rows.map((row) => row.key);
  }

  async isProjectMember(userId: number, companyId: number, projectId: number) {
    const [member] = await this.db
      .select({ userId: projectUsers.userId })
      .from(projectUsers)
      .innerJoin(projects, eq(projectUsers.projectId, projects.id))
      .where(
        and(
          eq(projectUsers.userId, userId),
          eq(projectUsers.projectId, projectId),
          eq(projects.companyId, companyId),
        ),
      )
      .limit(1);

    return Boolean(member);
  }
}
