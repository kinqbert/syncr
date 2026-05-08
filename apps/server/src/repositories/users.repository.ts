import { Injectable } from "@nestjs/common";
import { TaskStatus } from "@syncr/packages";
import { and, count, eq, sql } from "drizzle-orm";

import db from "../db/drizzle";
import { projects, projectUsers, roles, tasks, userCompanyRoles, users } from "../db/schema";

@Injectable()
export class UsersRepository {
  async createUser(data: typeof users.$inferInsert) {
    const [user] = await db.insert(users).values(data).returning();

    return user;
  }

  async getCompanyTeamUserData(companyId: number) {
    const companyUsers = await db
      .select({
        user: users,
        role: roles,
        assignedTasks: count(tasks.id),
        completedTasks: sql<number>`
        count(*) filter (where ${tasks.status} = ${TaskStatus.Done})`,
        assignedTasksWorkloadMinutes: sql<number>`coalesce(sum(${tasks.estimateMinutes}), 0)::int`,
      })
      .from(userCompanyRoles)
      .innerJoin(users, eq(users.id, userCompanyRoles.userId))
      .innerJoin(roles, eq(roles.id, userCompanyRoles.roleId))
      .leftJoin(tasks, eq(tasks.assigneeId, userCompanyRoles.userId))
      .where(eq(userCompanyRoles.companyId, companyId))
      .groupBy(
        users.id,
        roles.id,
        userCompanyRoles.userId,
        userCompanyRoles.companyId,
        userCompanyRoles.roleId,
      );

    return companyUsers;
  }

  async findUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    return user;
  }

  async findUserById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

    return user;
  }

  async isUserInCompany(userId: number, companyId: number) {
    const [userCompanyRole] = await db
      .select({ userId: userCompanyRoles.userId })
      .from(userCompanyRoles)
      .where(and(eq(userCompanyRoles.userId, userId), eq(userCompanyRoles.companyId, companyId)))
      .limit(1);

    return Boolean(userCompanyRole);
  }

  async isUserAssignedToProject(userId: number, projectId: number, companyId: number) {
    const [projectUser] = await db
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

    return Boolean(projectUser);
  }
}
