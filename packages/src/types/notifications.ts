import { type InvitationStatus } from "./invitations";

export const NotificationType = {
  TaskAssigned: "task_assigned",
  TaskCommented: "task_commented",
  TaskStatusChanged: "task_status_changed",
  TaskDeadlineChanged: "task_deadline_changed",
  TaskAcceptanceCriterionAdded: "task_acceptance_criterion_added",
  ProjectAdded: "project_added",
  CompanyInvitation: "company_invitation",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationEntityType = {
  Task: "task",
  Project: "project",
  Invitation: "invitation",
  TaskComment: "task_comment",
  AcceptanceCriterion: "acceptance_criterion",
};

export type NotificationEntityType =
  (typeof NotificationEntityType)[keyof typeof NotificationEntityType];

export type NotificationMetadata = {
  projectId?: number;
  taskName?: string;
  projectName?: string;
  invitationId?: number;
  invitationStatus?: InvitationStatus;
  companyId?: number;
  companyName?: string;
  roleName?: string;
};

export type NotificationPayload = {
  id: number;
  recipientId: number;
  actorId: number | null;
  type: NotificationType;
  entityType: NotificationEntityType;
  entityId: number;
  metadata?: NotificationMetadata | null;
  isRead: boolean;
  createdAt: string;
};
