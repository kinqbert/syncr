import { Injectable } from "@nestjs/common";
import { and, asc, count, eq, inArray } from "drizzle-orm";

import db from "../db/drizzle";
import { projects, tasks, userCompanyRoles } from "../db/schema";

@Injectable()
export class TasksRepository {
  async getProjectTasks(projectId: number, companyId: number) {
    return await db
      .select({
        id: tasks.id,
        name: tasks.name,
        description: tasks.description,
        projectId: tasks.projectId,
        assigneeId: tasks.assigneeId,
        status: tasks.status,
        priority: tasks.priority,
        position: tasks.position,
        endDate: tasks.endDate,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
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
      .select({
        id: tasks.id,
        name: tasks.name,
        description: tasks.description,
        projectId: tasks.projectId,
        assigneeId: tasks.assigneeId,
        status: tasks.status,
        priority: tasks.priority,
        position: tasks.position,
        endDate: tasks.endDate,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
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

  async getNextPosition(projectId: number, status: typeof tasks.$inferSelect.status) {
    const [result] = await db
      .select({ taskCount: count() })
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.status, status)));

    return result.taskCount;
  }

  async createTask(data: typeof tasks.$inferInsert) {
    const [task] = await db.insert(tasks).values(data).returning();

    return task;
  }

  async updateTask(taskId: number, data: Partial<typeof tasks.$inferInsert>) {
    const [task] = await db.update(tasks).set(data).where(eq(tasks.id, taskId)).returning();

    return task;
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

    return await db.transaction(async (tx) => {
      const updatedTasks: (typeof tasks.$inferSelect)[] = [];

      for (const item of items) {
        const [task] = await tx
          .update(tasks)
          .set({ status: item.status, position: item.position })
          .where(eq(tasks.id, item.id))
          .returning();

        updatedTasks.push(task);
      }

      return updatedTasks;
    });
  }
}
