export const NotificationType = {
  TaskAssigned: "task_assigned",
  TaskCommented: "task_commented",
  TaskStatusChanged: "task_status_changed",
  TaskDeadlineChanged: "task_deadline_changed",
  TaskAcceptanceCriterionAdded: "task_acceptance_criterion_added",
  ProjectAdded: "project_added",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationEntityType = {
  Task: "task",
  Project: "project",
  TaskComment: "task_comment",
  AcceptanceCriterion: "acceptance_criterion",
};

export type NotificationEntityType =
  (typeof NotificationEntityType)[keyof typeof NotificationEntityType];

export type NotificationMetadata = { taskName?: string; projectName?: string };
