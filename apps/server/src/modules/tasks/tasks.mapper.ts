import { TaskComment } from "@syncr/packages";
import { projectLabels, taskAcceptanceCriteria, taskComments, tasks } from "src/db/schema";

import { TaskDto } from "./tasks.dto";

type TaskRecord = Omit<typeof tasks.$inferSelect, "assigneeId" | "endDate"> & {
  assignee: {
    id: number | null;
    email: string | null;
    name: string | null;
    surname: string | null;
  } | null;
  acceptanceCriteria: (typeof taskAcceptanceCriteria.$inferSelect)[];
  labels: (typeof projectLabels.$inferSelect)[];
  endDate: Date | null;
};

export const mapTaskToDto = (task: TaskRecord): TaskDto => {
  return {
    id: task.id,
    name: task.name,
    description: task.description,
    projectId: task.projectId,
    assignee:
      task.assignee?.id != null &&
      task.assignee.email &&
      task.assignee.name &&
      task.assignee.surname
        ? {
            id: task.assignee.id,
            email: task.assignee.email,
            name: task.assignee.name,
            surname: task.assignee.surname,
          }
        : null,
    acceptanceCriteria: task.acceptanceCriteria,
    labels: task.labels,
    status: task.status,
    priority: task.priority,
    position: task.position,
    endDate: task.endDate ? task.endDate.toISOString() : null,
  };
};

type TaskCommentRecord = typeof taskComments.$inferSelect & {
  user: {
    id: number;
    email: string;
    name: string;
    surname: string;
  } | null;
};

export const mapTaskCommentToDto = (task: TaskCommentRecord): TaskComment => {
  return {
    id: task.id,
    taskId: task.taskId,
    content: task.content,
    author: task.user
      ? {
          id: task.user.id,
          email: task.user.email,
          name: task.user.name,
          surname: task.user.surname,
        }
      : null,
    createdAt: task.createdAt.toISOString(),
  };
};
