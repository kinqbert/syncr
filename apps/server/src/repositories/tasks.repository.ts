import { Injectable } from "@nestjs/common";
import { ProjectStatus, TaskStatus } from "@syncr/packages";
import { and, asc, count, eq, inArray, sql } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import { projects, tasks, users } from "../db/schema";
import { BaseRepository } from "./base.repository";

const taskWithAssigneeColumns = {
  id: tasks.id,
  name: tasks.name,
  description: tasks.description,
  projectId: tasks.projectId,
  project: {
    id: projects.id,
    name: projects.name,
    companyId: projects.companyId,
  },
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
  completedAt: tasks.completedAt,
  estimateMinutes: tasks.estimateMinutes,
};

const assignedTaskColumns = {
  ...taskWithAssigneeColumns,
};

@Injectable()
export class TasksRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async getProjectTasks(projectId: number, companyId: number) {
    return await this.db
      .select(taskWithAssigneeColumns)
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .where(and(eq(tasks.projectId, projectId), eq(projects.companyId, companyId)))
      .orderBy(asc(tasks.status), asc(tasks.position), asc(tasks.id));
  }

  async getAssignedTasks(userId: number, companyId: number) {
    return await this.db
      .select(assignedTaskColumns)
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .where(and(eq(tasks.assigneeId, userId), eq(projects.companyId, companyId)))
      .orderBy(asc(tasks.endDate), asc(tasks.priority), asc(tasks.id));
  }

  async getAssignedTasksWithDeadlines(userId: number) {
    return await this.db
      .select(taskWithAssigneeColumns)
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .where(and(eq(tasks.assigneeId, userId), sql`${tasks.endDate} is not null`))
      .orderBy(asc(tasks.endDate), asc(tasks.priority), asc(tasks.id));
  }

  async getProject(projectId: number, companyId: number) {
    const [project] = await this.db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.companyId, companyId)))
      .limit(1);

    return project;
  }

  async getTask(taskId: number) {
    const [task] = await this.db
      .select(taskWithAssigneeColumns)
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .where(and(eq(tasks.id, taskId)))
      .limit(1);

    return task;
  }

  async getCompanyTask(taskId: number, projectId: number, companyId: number) {
    const [task] = await this.db
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

  async getCompanyTeamTasksData(companyId: number) {
    const [data] = await this.db
      .select({
        activeProjects: sql<number>`count(distinct ${projects.id}) filter (where ${projects.status} = ${ProjectStatus.Active})::int`,
        tasksCompleted: sql<number>`count(${tasks.id}) filter (where ${tasks.status} = ${TaskStatus.Done})::int`,
      })
      .from(projects)
      .leftJoin(tasks, eq(tasks.projectId, projects.id))
      .where(eq(projects.companyId, companyId));

    return data;
  }

  async getNextPosition(projectId: number, status: typeof tasks.$inferSelect.status) {
    const [result] = await this.db
      .select({ taskCount: count() })
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.status, status)));

    return result.taskCount;
  }

  async createTask(data: typeof tasks.$inferInsert) {
    const [task] = await this.db.insert(tasks).values(data).returning();

    return await this.getTaskById(task.id);
  }

  async updateTask(taskId: number, data: Partial<typeof tasks.$inferInsert>) {
    const [task] = await this.db.update(tasks).set(data).where(eq(tasks.id, taskId)).returning();

    return await this.getTaskById(task.id);
  }

  async deleteTask(taskId: number) {
    const [task] = await this.db
      .delete(tasks)
      .where(eq(tasks.id, taskId))
      .returning({ id: tasks.id });

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

    const existingTasks = await this.db
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

    await this.db.transaction(async (tx) => {
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
    const [task] = await this.db
      .select(taskWithAssigneeColumns)
      .from(tasks)
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(tasks.id, taskId))
      .limit(1);

    return task;
  }
}
