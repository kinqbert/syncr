import { Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";

import db from "../db/drizzle";
import { taskActivities, users } from "../db/schema";

const taskActivityColumns = {
  id: taskActivities.id,
  taskId: taskActivities.taskId,
  userId: taskActivities.userId,
  action: taskActivities.action,
  previousValue: taskActivities.previousValue,
  newValue: taskActivities.newValue,
  createdAt: taskActivities.createdAt,
  user: {
    id: users.id,
    email: users.email,
    name: users.name,
    surname: users.surname,
  },
};

@Injectable()
export class TaskActivitiesRepository {
  async createTaskActivity(data: typeof taskActivities.$inferInsert) {
    const [activity] = await db.insert(taskActivities).values(data).returning();

    return this.getTaskActivity(activity.id);
  }

  async getTaskActivity(activityId: number) {
    const [activity] = await db
      .select(taskActivityColumns)
      .from(taskActivities)
      .leftJoin(users, eq(taskActivities.userId, users.id))
      .where(eq(taskActivities.id, activityId))
      .limit(1);

    return activity;
  }

  async getTaskActivities(taskId: number) {
    const activities = await db
      .select(taskActivityColumns)
      .from(taskActivities)
      .leftJoin(users, eq(taskActivities.userId, users.id))
      .where(eq(taskActivities.taskId, taskId))
      .orderBy(desc(taskActivities.createdAt), desc(taskActivities.id));

    return activities;
  }
}
