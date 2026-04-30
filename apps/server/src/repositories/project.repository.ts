import { Injectable } from "@nestjs/common";
import { RoleKey } from "@syncr/packages";
import { and, asc, eq, inArray } from "drizzle-orm";
import db from "src/db/drizzle";
import { projects, roles, userCompanyRoles, users } from "src/db/schema";

@Injectable()
export class ProjectRepository {
  async getCompanyProjects(companyId: number) {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.companyId, companyId))
      .orderBy(asc(projects.startDate), asc(projects.name));
  }

  async getProjectManagerCandidates(companyId: number) {
    const candidates = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        surname: users.surname,
        roleKey: roles.key,
        roleName: roles.name,
      })
      .from(userCompanyRoles)
      .where(
        and(
          eq(userCompanyRoles.companyId, companyId),
          inArray(roles.key, [RoleKey.Owner, RoleKey.ProjectManager]),
        ),
      )
      .innerJoin(users, eq(userCompanyRoles.userId, users.id))
      .innerJoin(roles, eq(userCompanyRoles.roleId, roles.id))
      .orderBy(asc(users.name), asc(users.surname));

    return candidates;
  }

  async isProjectManagerCandidate(companyId: number, userId: number) {
    const [candidate] = await db
      .select({ id: users.id })
      .from(userCompanyRoles)
      .where(
        and(
          eq(userCompanyRoles.companyId, companyId),
          eq(userCompanyRoles.userId, userId),
          inArray(roles.key, [RoleKey.Owner, RoleKey.ProjectManager]),
        ),
      )
      .innerJoin(users, eq(userCompanyRoles.userId, users.id))
      .innerJoin(roles, eq(userCompanyRoles.roleId, roles.id))
      .limit(1);

    return Boolean(candidate);
  }

  async createProject(data: typeof projects.$inferInsert) {
    const [project] = await db.insert(projects).values(data).returning();

    return project;
  }

  async updateProject(
    projectId: number,
    companyId: number,
    data: Partial<typeof projects.$inferInsert>,
  ) {
    const [project] = await db
      .update(projects)
      .set(data)
      .where(and(eq(projects.id, projectId), eq(projects.companyId, companyId)))
      .returning();

    return project;
  }
}
