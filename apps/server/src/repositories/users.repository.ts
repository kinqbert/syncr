import { Injectable } from "@nestjs/common";
import { TaskStatus } from "@syncr/packages";
import { and, count, eq, inArray, sql } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import { projects, projectUsers, roles, tasks, userCompanyRoles, users } from "../db/schema";
import { BaseRepository } from "./base.repository";

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async createUser(data: typeof users.$inferInsert) {
    const [user] = await this.db.insert(users).values(data).returning();

    return user;
  }

  async getCompanyUsers(companyId: number) {
    const result = await this.db
      .select()
      .from(userCompanyRoles)
      .where(eq(userCompanyRoles.companyId, companyId))
      .innerJoin(users, eq(users.id, userCompanyRoles.userId));

    return result.map((user) => user.users);
  }

  async getCompanyTeamUserData(companyId: number) {
    const companyUsers = await this.db
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
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    return user;
  }

  async findUsersByEmails(emails: string[]) {
    if (emails.length === 0) {
      return [];
    }

    return this.db.select().from(users).where(inArray(users.email, emails));
  }

  async findUserById(id: number) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);

    return user;
  }

  async updateUserProfile(
    userId: number,
    data: Pick<typeof users.$inferInsert, "name" | "surname" | "birthday" | "weeklyLoadMinutes">,
  ) {
    const [user] = await this.db.update(users).set(data).where(eq(users.id, userId)).returning();

    return user;
  }

  async updateUserPassword(userId: number, password: string) {
    const [user] = await this.db
      .update(users)
      .set({ password })
      .where(eq(users.id, userId))
      .returning();

    return user;
  }

  async isUserInCompany(userId: number, companyId: number) {
    const [userCompanyRole] = await this.db
      .select({ userId: userCompanyRoles.userId })
      .from(userCompanyRoles)
      .where(and(eq(userCompanyRoles.userId, userId), eq(userCompanyRoles.companyId, companyId)))
      .limit(1);

    return Boolean(userCompanyRole);
  }

  async areUsersInCompany(userIds: number[], companyId: number) {
    const companyUsers = await this.db
      .select({
        userId: userCompanyRoles.userId,
      })
      .from(userCompanyRoles)
      .where(
        and(
          inArray(userCompanyRoles.userId, userIds),

          eq(userCompanyRoles.companyId, companyId),
        ),
      );

    return companyUsers.length === userIds.length;
  }

  async getCompanyUsersByEmails(companyId: number, emails: string[]) {
    if (emails.length === 0) {
      return [];
    }

    return this.db
      .select({
        user: users,
      })
      .from(userCompanyRoles)
      .innerJoin(users, eq(users.id, userCompanyRoles.userId))
      .where(and(eq(userCompanyRoles.companyId, companyId), inArray(users.email, emails)));
  }

  async isUserAssignedToProject(userId: number, projectId: number, companyId: number) {
    const [projectUser] = await this.db
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
