import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import db from "../db/drizzle";
import { notifications } from "../db/schema";

export const DEFAULT_PROJECT_LABELS = ["bug", "feature", "misc"] as const;

@Injectable()
export class NotificationsRepository {
  async addNotification(values: typeof notifications.$inferInsert) {
    const [notification] = await db.insert(notifications).values(values).returning();

    return notification;
  }

  async addNotifications(values: (typeof notifications.$inferInsert)[]) {
    return await db.insert(notifications).values(values).returning();
  }

  async markNotificationAsRead(notificationId: number) {
    return await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId))
      .returning();
  }

  async markAllUserNotificationsRead(userId: number) {
    return await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.recipientId, userId));
  }
}
