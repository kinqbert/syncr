import { Injectable } from "@nestjs/common";
import { type NotificationMetadata, NotificationType } from "@syncr/packages";
import { and, desc, eq, isNull, or } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import { notifications } from "../db/schema";
import { BaseRepository } from "./base.repository";

export const DEFAULT_PROJECT_LABELS = ["bug", "feature", "misc"] as const;

@Injectable()
export class NotificationsRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async getUserNotifications(userId: number, companyId: number | null) {
    return await this.db
      .select()
      .from(notifications)
      .where(and(eq(notifications.recipientId, userId), this.companyScope(companyId)))
      .orderBy(desc(notifications.createdAt), desc(notifications.id));
  }

  async addNotification(values: typeof notifications.$inferInsert) {
    const [notification] = await this.db.insert(notifications).values(values).returning();

    return notification;
  }

  async addNotifications(values: (typeof notifications.$inferInsert)[]) {
    return await this.db.insert(notifications).values(values).returning();
  }

  async markNotificationAsRead(userId: number, notificationId: number, companyId: number | null) {
    const [notification] = await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.recipientId, userId),
          this.companyScope(companyId),
        ),
      )
      .returning();

    return notification;
  }

  async markAllUserNotificationsRead(userId: number, companyId: number | null) {
    return await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.recipientId, userId), this.companyScope(companyId)))
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

  private companyScope(companyId: number | null) {
    if (companyId === null) {
      return isNull(notifications.companyId);
    }

    return or(eq(notifications.companyId, companyId), isNull(notifications.companyId));
  }
}
