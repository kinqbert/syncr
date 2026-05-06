import { Injectable } from "@nestjs/common";
import { and, asc, count, eq, inArray } from "drizzle-orm";

import db from "../db/drizzle";
import { projects, projectUsers, tasks, userCompanyRoles, users } from "../db/schema";

const taskWithAssigneeColumns = {
  id: tasks.id,
  name: tasks.name,
  description: tasks.description,
  projectId: tasks.projectId,
  assignee: {
    id: users.id,
    email: users.email,
    name: users.name,
    surname: users.surname,
  },
  status: tasks.status,
  priority: tasks.priority,
  position: tasks.position,
  endDate: tasks.endDate,
};

@Injectable()
export class TasksRepository {
  async getProjectTasks(projectId: number, companyId: number) {
    return await db
      .select(taskWithAssigneeColumns)
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .where(and(eq(tasks.projectId, projectId), eq(projects.companyId, companyId)))
      .orderBy(asc(tasks.status), asc(tasks.position), asc(tasks.id));
  }

  async getProject(projectId: number, companyId: number) {
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.companyId, companyId)))
      .limit(1);

    return project;
  }

  async getTask(taskId: number, projectId: number, companyId: number) {
    const [task] = await db
      .select(taskWithAssigneeColumns)
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .where(
        and(
          eq(tasks.id, taskId),
          eq(tasks.projectId, projectId),
          eq(projects.companyId, companyId),
        ),
      )
      .limit(1);

    return task;
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

  async getNextPosition(projectId: number, status: typeof tasks.$inferSelect.status) {
    const [result] = await db
      .select({ taskCount: count() })
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.status, status)));

    return result.taskCount;
  }

  async createTask(data: typeof tasks.$inferInsert) {
    const [task] = await db.insert(tasks).values(data).returning();

    return await this.getTaskById(task.id);
  }

  async updateTask(taskId: number, data: Partial<typeof tasks.$inferInsert>) {
    const [task] = await db.update(tasks).set(data).where(eq(tasks.id, taskId)).returning();

    return await this.getTaskById(task.id);
  }

  async deleteTask(taskId: number) {
    const [task] = await db.delete(tasks).where(eq(tasks.id, taskId)).returning({ id: tasks.id });

    return task;
  }

  async reorderTasks(
    projectId: number,
    companyId: number,
    items: Pick<typeof tasks.$inferSelect, "id" | "status" | "position">[],
  ) {
    if (items.length === 0) {
      return [];
    }

    const taskIds = items.map((item) => item.id);

    const existingTasks = await db
      .select({ id: tasks.id })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          inArray(tasks.id, taskIds),
          eq(tasks.projectId, projectId),
          eq(projects.companyId, companyId),
        ),
      );

    if (existingTasks.length !== taskIds.length) {
      return null;
    }

    await db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .update(tasks)
          .set({ status: item.status, position: item.position })
          .where(eq(tasks.id, item.id));
      }
    });

    return await this.getProjectTasks(projectId, companyId);
  }

  private async getTaskById(taskId: number) {
    const [task] = await db
      .select(taskWithAssigneeColumns)
      .from(tasks)
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .where(eq(tasks.id, taskId))
      .limit(1);

    return task;
  }
}
