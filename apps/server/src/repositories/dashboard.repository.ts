import { Injectable } from "@nestjs/common";
import { ProjectStatus, TaskActivityAction, TaskStatus } from "@syncr/packages";
import { and, asc, desc, eq, gte, isNotNull, lt, ne, sql } from "drizzle-orm";

import db from "../db/drizzle";
import {
  notifications,
  projects,
  taskActivities,
  tasks,
  userCompanyRoles,
  users,
} from "../db/schema";

@Injectable()
export class DashboardRepository {
  async getSummary(companyId: number, userId: number) {
    const [
      activeProjects,
      tasksCompleted,
      tasksDueToday,
      teamMembers,
      myAssignedTasks,
      unreadNotifications,
    ] = await Promise.all([
      db
        .select({
          value: sql<number>`count(*)::int`.mapWith(Number),
        })
        .from(projects)
        .where(
          and(
            eq(projects.companyId, companyId),
            eq(projects.status, ProjectStatus.Active),
          ),
        ),
      db
        .select({
          value: sql<number>`count(${tasks.id})::int`.mapWith(Number),
        })
        .from(tasks)
        .innerJoin(projects, eq(tasks.projectId, projects.id))
        .where(
          and(eq(projects.companyId, companyId), eq(tasks.status, TaskStatus.Done)),
        ),
      db
        .select({
          value: sql<number>`count(${tasks.id})::int`.mapWith(Number),
        })
        .from(tasks)
        .innerJoin(projects, eq(tasks.projectId, projects.id))
        .where(
          and(
            eq(projects.companyId, companyId),
            ne(tasks.status, TaskStatus.Done),
            sql`${tasks.endDate}::date = current_date`,
          ),
        ),
      db
        .select({
          value: sql<number>`count(distinct ${userCompanyRoles.userId})::int`.mapWith(Number),
        })
        .from(userCompanyRoles)
        .where(eq(userCompanyRoles.companyId, companyId)),
      db
        .select({
          value: sql<number>`count(${tasks.id})::int`.mapWith(Number),
        })
        .from(tasks)
        .innerJoin(projects, eq(tasks.projectId, projects.id))
        .where(
          and(
            eq(projects.companyId, companyId),
            eq(tasks.assigneeId, userId),
            ne(tasks.status, TaskStatus.Done),
          ),
        ),
      db
        .select({
          value: sql<number>`count(${notifications.id})::int`.mapWith(Number),
        })
        .from(notifications)
        .where(
          and(
            eq(notifications.recipientId, userId),
            eq(notifications.isRead, false),
          ),
        ),
    ]);

    return {
      activeProjects: activeProjects[0]?.value ?? 0,
      tasksCompleted: tasksCompleted[0]?.value ?? 0,
      tasksDueToday: tasksDueToday[0]?.value ?? 0,
      teamMembers: teamMembers[0]?.value ?? 0,
      myAssignedTasks: myAssignedTasks[0]?.value ?? 0,
      unreadNotifications: unreadNotifications[0]?.value ?? 0,
    };
  }

  async getTasksCompletedThisWeek(companyId: number) {
    const day = sql<string>`to_char(${tasks.completedAt}, 'YYYY-MM-DD')`;

    return await db
      .select({
        day,
        value: sql<number>`count(${tasks.id})::int`.mapWith(Number),
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(projects.companyId, companyId),
          isNotNull(tasks.completedAt),
          gte(tasks.completedAt, sql`date_trunc('week', current_date)`),
          lt(tasks.completedAt, sql`date_trunc('week', current_date) + interval '7 days'`),
        ),
      )
      .groupBy(day)
      .orderBy(asc(day));
  }

  async getUpcomingBirthdays(companyId: number) {
    return await db
      .select({
        userId: users.id,
        name: users.name,
        surname: users.surname,
        birthday: users.birthday,
      })
      .from(userCompanyRoles)
      .innerJoin(users, eq(users.id, userCompanyRoles.userId))
      .where(
        and(
          eq(userCompanyRoles.companyId, companyId),
          isNotNull(users.birthday),
        ),
      );
  }

  async getRecentActivity(companyId: number, limit = 5) {
    return await db
      .select({
        id: taskActivities.id,
        action: taskActivities.action,
        createdAt: taskActivities.createdAt,
        actor: {
          id: users.id,
          name: users.name,
          surname: users.surname,
        },
        task: {
          id: tasks.id,
          name: tasks.name,
        },
      })
      .from(taskActivities)
      .innerJoin(tasks, eq(taskActivities.taskId, tasks.id))
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(users, eq(taskActivities.userId, users.id))
      .where(
        and(
          eq(projects.companyId, companyId),
          ne(taskActivities.action, TaskActivityAction.TaskUpdated),
        ),
      )
      .orderBy(desc(taskActivities.createdAt), desc(taskActivities.id))
      .limit(limit);
  }
}
