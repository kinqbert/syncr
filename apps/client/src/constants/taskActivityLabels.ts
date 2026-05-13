import { TaskActivityAction } from "@syncr/packages";

export const TASK_ACTIVITY_LABEL: Record<TaskActivityAction, string> = {
  [TaskActivityAction.TaskCreated]: "created task",
  [TaskActivityAction.TaskUpdated]: "updated task",
  [TaskActivityAction.TaskNameUpdated]: "renamed task",
  [TaskActivityAction.TaskDescriptionUpdated]: "updated task description",
  [TaskActivityAction.TaskAssigneeUpdated]: "changed assignee for",
  [TaskActivityAction.TaskStatusUpdated]: "changed status for",
  [TaskActivityAction.TaskPriorityUpdated]: "changed priority for",
  [TaskActivityAction.TaskDeadlineUpdated]: "changed deadline for",
  [TaskActivityAction.TaskEstimateUpdated]: "changed estimate for",
  [TaskActivityAction.TaskLabelsUpdated]: "updated labels for",
  [TaskActivityAction.TaskCommentAdded]: "commented on",
  [TaskActivityAction.AcceptanceCriterionCreated]:
    "added acceptance criteria to",
  [TaskActivityAction.AcceptanceCriterionUpdated]:
    "updated acceptance criteria on",
  [TaskActivityAction.AcceptanceCriterionDeleted]:
    "removed acceptance criteria from",
};
