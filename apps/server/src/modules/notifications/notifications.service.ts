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

  async getUserNotifications(userId: number, companyId: number) {
    const notifications = await this.notificationsRepository.getUserNotifications(
      userId,
      this.getNotificationCompanyId(companyId),
    );

    return notifications.map(mapNotificationToPayload);
  }

  async markNotificationAsRead(userId: number, notificationId: number, companyId: number) {
    const notification = await this.notificationsRepository.markNotificationAsRead(
      userId,
      notificationId,
      this.getNotificationCompanyId(companyId),
    );

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    return mapNotificationToPayload(notification);
  }

  async markAllUserNotificationsRead(userId: number, companyId: number) {
    const notifications = await this.notificationsRepository.markAllUserNotificationsRead(
      userId,
      this.getNotificationCompanyId(companyId),
    );

    return notifications.map(mapNotificationToPayload);
  }

  async notifyTaskAssigned(recipientId: number, actorId: number, taskId: number) {
    const metadata = await this.getTaskMetadata(taskId);

    await this.createAndSendNotification({
      recipientId,
      companyId: metadata.companyId,
      actorId,
      type: NotificationType.TaskAssigned,
      entityType: NotificationEntityType.Task,
      entityId: taskId,
      metadata,
    });
  }

  async notifyTaskCommented(recipientId: number, actorId: number, taskId: number) {
    const metadata = await this.getTaskMetadata(taskId);

    await this.createAndSendNotification({
      recipientId,
      companyId: metadata.companyId,
      actorId,
      type: NotificationType.TaskCommented,
      entityType: NotificationEntityType.Task,
      entityId: taskId,
      metadata,
    });
  }

  async notifyTaskStatusChanged(recipientId: number, actorId: number, taskId: number) {
    const metadata = await this.getTaskMetadata(taskId);

    await this.createAndSendNotification({
      recipientId,
      companyId: metadata.companyId,
      actorId,
      type: NotificationType.TaskStatusChanged,
      entityType: NotificationEntityType.Task,
      entityId: taskId,
      metadata,
    });
  }

  async notifyTaskDeadlineChanged(recipientId: number, actorId: number, taskId: number) {
    const metadata = await this.getTaskMetadata(taskId);

    await this.createAndSendNotification({
      recipientId,
      companyId: metadata.companyId,
      actorId,
      type: NotificationType.TaskDeadlineChanged,
      entityType: NotificationEntityType.Task,
      entityId: taskId,
      metadata,
    });
  }

  async notifyTaskAcceptanceCriterionAdded(recipientId: number, actorId: number, taskId: number) {
    const metadata = await this.getTaskMetadata(taskId);

    await this.createAndSendNotification({
      recipientId,
      companyId: metadata.companyId,
      actorId,
      type: NotificationType.TaskAcceptanceCriterionAdded,
      entityType: NotificationEntityType.Task,
      entityId: taskId,
      metadata,
    });
  }

  async notifyProjectAdded(recipientId: number, actorId: number, projectId: number) {
    const project = await this.projectsRepository.getProject(projectId);

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    await this.createAndSendNotification({
      recipientId,
      companyId: project.companyId,
      actorId,
      type: NotificationType.ProjectAdded,
      entityType: NotificationEntityType.Project,
      entityId: projectId,
      metadata: {
        companyId: project.companyId,
        projectId,
        projectName: project.name,
      },
    });
  }

  private async getTaskMetadata(taskId: number): Promise<NotificationMetadata> {
    const task = await this.tasksRepository.getTask(taskId);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    return {
      companyId: task.project.companyId,
      projectId: task.projectId,
      taskName: task.name,
    };
  }

  private getNotificationCompanyId(companyId: number) {
    return Number.isInteger(companyId) && companyId > 0 ? companyId : null;
  }

  private async createAndSendNotification(values: typeof notifications.$inferInsert) {
    const notification = await this.notificationsRepository.addNotification(values);

    this.notificationsGateway.sendNotification(
      notification.recipientId,
      mapNotificationToPayload(notification),
    );
  }
}
