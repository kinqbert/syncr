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
};

export type CreateTaskBody = {
  name: string;
  description?: string | null;
  assigneeId: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  position?: number;
  endDate?: string | null;
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

export type SetTaskAssigneeBody = {
  assigneeId: number | null;
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
