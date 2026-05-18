import { Injectable } from "@nestjs/common";
import { RoleKey, TaskStatus } from "@syncr/packages";
import { and, asc, eq, inArray, sql } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import {
  projectLabels,
  projects,
  projectUsers,
  roles,
  tasks,
  userCompanyRoles,
  users,
} from "../db/schema";
import { BaseRepository } from "./base.repository";
import { DEFAULT_PROJECT_LABELS } from "./labels.repository";

@Injectable()
export class ProjectsRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async getCompanyProjects(companyId: number) {
    return await this.db
      .select({
        project: projects,
        assignedPeopleCount: sql<number>`count(distinct ${projectUsers.userId})::int`,
        completedTasksCount: sql<number>`count(distinct ${tasks.id}) filter (where ${tasks.status} = ${TaskStatus.Done})::int`,
        totalTasksCount: sql<number>`count(distinct ${tasks.id})::int`,
      })
      .from(projects)
      .leftJoin(projectUsers, eq(projectUsers.projectId, projects.id))
      .leftJoin(tasks, eq(tasks.projectId, projects.id))
      .where(eq(projects.companyId, companyId))
      .groupBy(projects.id)
      .orderBy(asc(projects.startDate), asc(projects.name));
  }

  async getCompanyProject(companyId: number, projectId: number) {
    const [project] = await this.db
      .select()
      .from(projects)
      .where(and(eq(projects.companyId, companyId), eq(projects.id, projectId)))
      .orderBy(asc(projects.startDate), asc(projects.name));

    return project;
  }

  async getProject(projectId: number) {
    const [project] = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    return project;
  }

  async getProjectManagerCandidates(companyId: number) {
    const candidates = await this.db
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

  async getProjectAssignees(companyId: number, projectId: number) {
    return await this.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        surname: users.surname,
      })
      .from(projectUsers)
      .innerJoin(projects, eq(projectUsers.projectId, projects.id))
      .innerJoin(users, eq(projectUsers.userId, users.id))
      .where(and(eq(projects.companyId, companyId), eq(projectUsers.projectId, projectId)))
      .orderBy(asc(users.name), asc(users.surname));
  }

  async getProjectMemberCandidates(companyId: number) {
    return await this.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        surname: users.surname,
        roleKey: roles.key,
        roleName: roles.name,
      })
      .from(userCompanyRoles)
      .where(eq(userCompanyRoles.companyId, companyId))
      .innerJoin(users, eq(userCompanyRoles.userId, users.id))
      .innerJoin(roles, eq(userCompanyRoles.roleId, roles.id))
      .orderBy(asc(users.name), asc(users.surname));
  }

  async isUserInCompany(companyId: number, userId: number) {
    const [companyUser] = await this.db
      .select({ userId: userCompanyRoles.userId })
      .from(userCompanyRoles)
      .where(and(eq(userCompanyRoles.companyId, companyId), eq(userCompanyRoles.userId, userId)))
      .limit(1);

    return Boolean(companyUser);
  }

  async isUserAssignedToProject(companyId: number, projectId: number, userId: number) {
    const [projectUser] = await this.db
      .select({ userId: projectUsers.userId })
      .from(projectUsers)
      .innerJoin(projects, eq(projectUsers.projectId, projects.id))
      .where(
        and(
          eq(projects.companyId, companyId),
          eq(projectUsers.projectId, projectId),
          eq(projectUsers.userId, userId),
        ),
      )
      .limit(1);

    return Boolean(projectUser);
  }

  async addProjectMember(projectId: number, userId: number) {
    const [projectUser] = await this.db
      .insert(projectUsers)
      .values({ projectId, userId })
      .returning();

    return projectUser;
  }

  async removeProjectMember(companyId: number, projectId: number, userId: number) {
    return await this.db.transaction(async (tx) => {
      const [projectUser] = await tx
        .delete(projectUsers)
        .where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.userId, userId)))
        .returning();

      if (!projectUser) {
        return null;
      }

      await tx
        .update(tasks)
        .set({ assigneeId: null })
        .where(and(eq(tasks.projectId, projectId), eq(tasks.assigneeId, userId)));

      await tx
        .update(projects)
        .set({ managerId: null })
        .where(
          and(
            eq(projects.id, projectId),
            eq(projects.companyId, companyId),
            eq(projects.managerId, userId),
          ),
        );

      return projectUser;
    });
  }

  async isProjectManagerCandidate(companyId: number, userId: number) {
    const [candidate] = await this.db
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
    return await this.db.transaction(async (tx) => {
      const [project] = await tx.insert(projects).values(data).returning();

      if (data.managerId) {
        await tx.insert(projectUsers).values({ userId: data.managerId, projectId: project.id });
      }

      await tx
        .insert(projectLabels)
        .values(DEFAULT_PROJECT_LABELS.map((name) => ({ projectId: project.id, name })));

      return project;
    });
  }

  async updateProject(
    projectId: number,
    companyId: number,
    data: Partial<typeof projects.$inferInsert>,
  ) {
    const [project] = await this.db
      .update(projects)
      .set(data)
      .where(and(eq(projects.id, projectId), eq(projects.companyId, companyId)))
      .returning();

    return project;
  }
}
