import { AssignedTask, ProjectActivity, TaskActivity, TaskComment } from "@syncr/packages";
import {
  projectLabels,
  taskAcceptanceCriteria,
  taskActivities,
  taskComments,
  tasks,
} from "src/db/schema";

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
    estimateMinutes: task.estimateMinutes,
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

type TaskActivityRecord = typeof taskActivities.$inferSelect & {
  user: {
    id: number;
    email: string;
    name: string;
    surname: string;
  } | null;
};

export const mapTaskActivityToDto = (activity: TaskActivityRecord): TaskActivity => {
  return {
    id: activity.id,
    taskId: activity.taskId,
    action: activity.action,
    previousValue: activity.previousValue,
    newValue: activity.newValue,
    actor: activity.user
      ? {
          id: activity.user.id,
          email: activity.user.email,
          name: activity.user.name,
          surname: activity.user.surname,
        }
      : null,
    createdAt: activity.createdAt.toISOString(),
  };
};

type AssignedTaskRecord = TaskRecord & {
  project: {
    id: number;
    name: string;
  };
};

export const mapAssignedTaskToDto = (task: AssignedTaskRecord): AssignedTask => {
  return {
    ...mapTaskToDto(task),
    project: task.project,
  };
};

type ProjectTaskActivityRecord = TaskActivityRecord & {
  task: {
    id: number;
    name: string;
  };
};

export const mapProjectTaskActivityToDto = (
  activity: ProjectTaskActivityRecord,
): ProjectActivity => {
  return {
    ...mapTaskActivityToDto(activity),
    task: activity.task,
  };
};
