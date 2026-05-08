import { Injectable } from "@nestjs/common";
import { and, desc, eq } from "drizzle-orm";

import db from "../db/drizzle";
import { notifications } from "../db/schema";

export const DEFAULT_PROJECT_LABELS = ["bug", "feature", "misc"] as const;

@Injectable()
export class NotificationsRepository {
  async getUserNotifications(userId: number) {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.recipientId, userId))
      .orderBy(desc(notifications.createdAt), desc(notifications.id));
  }

  async addNotification(values: typeof notifications.$inferInsert) {
    const [notification] = await db.insert(notifications).values(values).returning();

    return notification;
  }

  async addNotifications(values: (typeof notifications.$inferInsert)[]) {
    return await db.insert(notifications).values(values).returning();
  }

  async markNotificationAsRead(userId: number, notificationId: number) {
    const [notification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.recipientId, userId)))
      .returning();

    return notification;
  }

  async markAllUserNotificationsRead(userId: number) {
    return await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.recipientId, userId))
      .returning();
  }
}
