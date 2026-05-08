import { Injectable, NotFoundException } from "@nestjs/common";
import {
  NotificationEntityType,
  type NotificationMetadata,
  NotificationType,
} from "@syncr/packages";
import { notifications } from "src/db/schema";
import { NotificationsRepository } from "src/repositories/notifications.repository";
import { ProjectsRepository } from "src/repositories/projects.repository";
import { TasksRepository } from "src/repositories/tasks.repository";

import { NotificationsGateway } from "./notifications.gateway";
import { mapNotificationToPayload } from "./notifications.mapper";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly tasksRepository: TasksRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async getUserNotifications(userId: number) {
    const notifications = await this.notificationsRepository.getUserNotifications(userId);

    return notifications.map(mapNotificationToPayload);
  }

  async markNotificationAsRead(userId: number, notificationId: number) {
    const notification = await this.notificationsRepository.markNotificationAsRead(
      userId,
      notificationId,
    );

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    return mapNotificationToPayload(notification);
  }

  async markAllUserNotificationsRead(userId: number) {
    const notifications = await this.notificationsRepository.markAllUserNotificationsRead(userId);

    return notifications.map(mapNotificationToPayload);
  }

  async notifyTaskAssigned(recipientId: number, actorId: number, taskId: number) {
    await this.createAndSendNotification({
      recipientId,
      actorId,
      type: NotificationType.TaskAssigned,
      entityType: NotificationEntityType.Task,
      entityId: taskId,
      metadata: await this.getTaskMetadata(taskId),
    });
  }

  async notifyTaskCommented(recipientId: number, actorId: number, taskId: number) {
    await this.createAndSendNotification({
      recipientId,
      actorId,
      type: NotificationType.TaskCommented,
      entityType: NotificationEntityType.Task,
      entityId: taskId,
      metadata: await this.getTaskMetadata(taskId),
    });
  }

  async notifyTaskStatusChanged(recipientId: number, actorId: number, taskId: number) {
    await this.createAndSendNotification({
      recipientId,
      actorId,
      type: NotificationType.TaskStatusChanged,
      entityType: NotificationEntityType.Task,
      entityId: taskId,
      metadata: await this.getTaskMetadata(taskId),
    });
  }

  async notifyTaskDeadlineChanged(recipientId: number, actorId: number, taskId: number) {
    await this.createAndSendNotification({
      recipientId,
      actorId,
      type: NotificationType.TaskDeadlineChanged,
      entityType: NotificationEntityType.Task,
      entityId: taskId,
      metadata: await this.getTaskMetadata(taskId),
    });
  }

  async notifyTaskAcceptanceCriterionAdded(recipientId: number, actorId: number, taskId: number) {
    await this.createAndSendNotification({
      recipientId,
      actorId,
      type: NotificationType.TaskAcceptanceCriterionAdded,
      entityType: NotificationEntityType.Task,
      entityId: taskId,
      metadata: await this.getTaskMetadata(taskId),
    });
  }

  async notifyProjectAdded(recipientId: number, actorId: number, projectId: number) {
    const project = await this.projectsRepository.getProject(projectId);

    await this.createAndSendNotification({
      recipientId,
      actorId,
      type: NotificationType.ProjectAdded,
      entityType: NotificationEntityType.Project,
      entityId: projectId,
      metadata: {
        projectId,
        projectName: project.name,
      },
    });
  }

  private async getTaskMetadata(taskId: number): Promise<NotificationMetadata> {
    const task = await this.tasksRepository.getTask(taskId);

    return {
      projectId: task.projectId,
      taskName: task.name,
    };
  }

  private async createAndSendNotification(values: typeof notifications.$inferInsert) {
    const notification = await this.notificationsRepository.addNotification(values);

    this.notificationsGateway.sendNotification(
      notification.recipientId,
      mapNotificationToPayload(notification),
    );
  }
}
