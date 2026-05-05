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

export type Task = {
  id: number;
  name: string;
  description: string;
  projectId: number;
  assigneeId: number;
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
};

export type UpdateTaskBody = {
  name?: string;
  description?: string | null;
  assigneeId?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  position?: number;
  endDate?: string | null;
};

export type UpdateTaskStatusBody = {
  status: TaskStatus;
  position?: number;
};

export type ReorderTaskItem = {
  id: number;
  status: TaskStatus;
  position: number;
};

export type ReorderTasksBody = {
  tasks: ReorderTaskItem[];
};
