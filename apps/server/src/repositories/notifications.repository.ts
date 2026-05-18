import { Injectable } from "@nestjs/common";
import { type NotificationMetadata, NotificationType } from "@syncr/packages";
import { and, desc, eq } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import { notifications } from "../db/schema";
import { BaseRepository } from "./base.repository";

export const DEFAULT_PROJECT_LABELS = ["bug", "feature", "misc"] as const;

@Injectable()
export class NotificationsRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async getUserNotifications(userId: number) {
    return await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.recipientId, userId))
      .orderBy(desc(notifications.createdAt), desc(notifications.id));
  }

  async addNotification(values: typeof notifications.$inferInsert) {
    const [notification] = await this.db.insert(notifications).values(values).returning();

    return notification;
  }

  async addNotifications(values: (typeof notifications.$inferInsert)[]) {
    return await this.db.insert(notifications).values(values).returning();
  }

  async markNotificationAsRead(userId: number, notificationId: number) {
    const [notification] = await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.recipientId, userId)))
      .returning();

    return notification;
  }

  async markAllUserNotificationsRead(userId: number) {
    return await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.recipientId, userId))
      .returning();
  }

  async updateInvitationNotificationMetadata(
    userId: number,
    invitationId: number,
    metadata: NotificationMetadata,
  ) {
    const [notification] = await this.db
      .update(notifications)
      .set({ isRead: true, metadata })
      .where(
        and(
          eq(notifications.recipientId, userId),
          eq(notifications.type, NotificationType.CompanyInvitation),
          eq(notifications.entityId, invitationId),
        ),
      )
      .returning();

    return notification;
  }
}
