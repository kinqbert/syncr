import { NotificationPayload } from "@syncr/packages";
import { notifications } from "src/db/schema";

export const mapNotificationToPayload = (
  notification: typeof notifications.$inferSelect,
): NotificationPayload => {
  return {
    id: notification.id,
    recipientId: notification.recipientId,
    companyId: notification.companyId,
    actorId: notification.actorId,
    type: notification.type,
    entityType: notification.entityType,
    entityId: notification.entityId,
    metadata: notification.metadata,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  };
};
