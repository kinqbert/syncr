export const TaskStatus = {
  Backlog: "backlog",
  Todo: "todo",
  InProgress: "in_progress",
  Review: "review",
  Done: "done",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.Backlog]: "Backlog",
  [TaskStatus.Todo]: "Todo",
  [TaskStatus.InProgress]: "In Progress",
  [TaskStatus.Review]: "Review",
  [TaskStatus.Done]: "Done",
};

export const TaskPriority = {
  Low: "low",
  Medium: "medium",
  High: "high",
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "Low",
  [TaskPriority.Medium]: "Medium",
  [TaskPriority.High]: "High",
};

type TaskUserBase = {
  id: number;
  email: string;
  name: string;
  surname: string;
};

export type TaskAssignee = TaskUserBase;

export type TaskAcceptanceCriterion = {
  id: number;
  taskId: number;
  description: string;
  isDone: boolean;
  position: number;
};

export type TaskLabel = {
  id: number;
  projectId: number;
  name: string;
};

export type TaskCommentAuthor = TaskUserBase;

export type TaskComment = {
  id: number;
  taskId: number;
  author: TaskCommentAuthor | null;
  content: string;
  createdAt: string;
};

export const TaskActivityAction = {
  TaskCreated: "task_created",
  TaskUpdated: "task_updated",
  TaskNameUpdated: "task_name_updated",
  TaskDescriptionUpdated: "task_description_updated",
  TaskAssigneeUpdated: "task_assignee_updated",
  TaskStatusUpdated: "task_status_updated",
  TaskPriorityUpdated: "task_priority_updated",
  TaskDeadlineUpdated: "task_deadline_updated",
  TaskEstimateUpdated: "task_estimate_updated",
  TaskLabelsUpdated: "task_labels_updated",
  TaskCommentAdded: "task_comment_added",
  AcceptanceCriterionCreated: "acceptance_criterion_created",
  AcceptanceCriterionUpdated: "acceptance_criterion_updated",
  AcceptanceCriterionDeleted: "acceptance_criterion_deleted",
} as const;

export type TaskActivityAction =
  (typeof TaskActivityAction)[keyof typeof TaskActivityAction];

export type TaskActivityActor = TaskUserBase;

export type TaskActivity = {
  id: number;
  taskId: number;
  action: TaskActivityAction;
  actor: TaskActivityActor | null;
  previousValue: string | null;
  newValue: string | null;
  createdAt: string;
};

export type Task = {
  id: number;
  name: string;
  description: string;
  projectId: number;
  assignee: TaskAssignee | null;
  acceptanceCriteria: TaskAcceptanceCriterion[];
  labels: TaskLabel[];
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  endDate: string | null;
  estimateMinutes: number | null;
};

export type CreateTaskBody = {
  name: string;
  description?: string | null;
  assigneeId?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  position?: number;
  endDate?: string | null;
  estimateMinutes?: number | null;
  labelNames?: string[];
};

export type UpdateTaskBody = {
  name?: string;
  description?: string | null;
  assigneeId?: number | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  position?: number;
  endDate?: string | null;
  estimateMinutes?: number | null;
  labelNames?: string[];
};

export type ReorderTaskItem = {
  id: number;
  status: TaskStatus;
  position: number;
};

export type ReorderTasksBody = {
  tasks: ReorderTaskItem[];
};

export type CreateTaskAcceptanceCriterionBody = {
  description: string;
  isDone?: boolean;
  position?: number;
};

export type UpdateTaskAcceptanceCriterionBody = {
  description?: string;
  isDone?: boolean;
  position?: number;
};

export type CreateTaskCommentBody = {
  content: string;
};
