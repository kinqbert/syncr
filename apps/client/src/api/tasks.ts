import type {
  CreateTaskAcceptanceCriterionBody,
  CreateTaskBody,
  CreateTaskCommentBody,
  ReorderTasksBody,
  SetTaskAssigneeBody,
  Task,
  TaskActivity,
  TaskComment,
  UpdateTaskAcceptanceCriterionBody,
  UpdateTaskBody,
} from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export const taskKeys = {
  projectTasks: (projectId: number) =>
    ["projects", projectId, "tasks"] as const,
  taskComments: (projectId: number, taskId: number) =>
    ["projects", projectId, "tasks", taskId, "comments"] as const,
  taskActivities: (projectId: number, taskId: number) =>
    ["projects", projectId, "tasks", taskId, "activities"] as const,
};

const getProjectTasks = async (projectId: number) => {
  const response = await api.get<Task[]>(`projects/${projectId}/tasks`);

  return response.data;
};

const createTask = async ({
  projectId,
  body,
}: {
  projectId: number;
  body: CreateTaskBody;
}) => {
  const response = await api.post<Task>(`projects/${projectId}/tasks`, body);

  return response.data;
};

const updateTask = async ({
  projectId,
  taskId,
  body,
}: {
  projectId: number;
  taskId: number;
  body: UpdateTaskBody;
}) => {
  const response = await api.patch<Task>(
    `projects/${projectId}/tasks/${taskId}`,
    body,
  );

  return response.data;
};

const reorderTasks = async ({
  projectId,
  body,
}: {
  projectId: number;
  body: ReorderTasksBody;
}) => {
  const response = await api.patch<Task[]>(
    `projects/${projectId}/tasks/reorder`,
    body,
  );

  return response.data;
};

const setTaskAssignee = async ({
  projectId,
  taskId,
  body,
}: {
  projectId: number;
  taskId: number;
  body: SetTaskAssigneeBody;
}) => {
  const response = await api.patch<Task>(
    `projects/${projectId}/tasks/${taskId}/set-assignee`,
    body,
  );

  return response.data;
};

const deleteTask = async ({
  projectId,
  taskId,
}: {
  projectId: number;
  taskId: number;
}) => {
  await api.delete(`projects/${projectId}/tasks/${taskId}`);
};

const createTaskAcceptanceCriterion = async ({
  projectId,
  taskId,
  body,
}: {
  projectId: number;
  taskId: number;
  body: CreateTaskAcceptanceCriterionBody;
}) => {
  const response = await api.post<Task>(
    `projects/${projectId}/tasks/${taskId}/acceptance-criteria`,
    body,
  );

  return response.data;
};

const updateTaskAcceptanceCriterion = async ({
  projectId,
  taskId,
  criterionId,
  body,
}: {
  projectId: number;
  taskId: number;
  criterionId: number;
  body: UpdateTaskAcceptanceCriterionBody;
}) => {
  const response = await api.patch<Task>(
    `projects/${projectId}/tasks/${taskId}/acceptance-criteria/${criterionId}`,
    body,
  );

  return response.data;
};

const deleteTaskAcceptanceCriterion = async ({
  projectId,
  taskId,
  criterionId,
}: {
  projectId: number;
  taskId: number;
  criterionId: number;
}) => {
  const response = await api.delete<Task>(
    `projects/${projectId}/tasks/${taskId}/acceptance-criteria/${criterionId}`,
  );

  return response.data;
};

const createTaskComment = async ({
  projectId,
  taskId,
  body,
}: {
  projectId: number;
  taskId: number;
  body: CreateTaskCommentBody;
}) => {
  const response = await api.post<TaskComment>(
    `projects/${projectId}/tasks/${taskId}/comments`,
    body,
  );

  return response.data;
};

const getTaskComments = async ({
  projectId,
  taskId,
}: {
  projectId: number;
  taskId: number;
}) => {
  const response = await api.get<TaskComment[]>(
    `projects/${projectId}/tasks/${taskId}/comments`,
  );

  return response.data;
};

const getTaskActivities = async ({
  projectId,
  taskId,
}: {
  projectId: number;
  taskId: number;
}) => {
  const response = await api.get<TaskActivity[]>(
    `projects/${projectId}/tasks/${taskId}/activities`,
  );

  return response.data;
};

export const useGetProjectTasks = (projectId: number, enabled = true) => {
  return useQuery({
    enabled,
    queryFn: () => getProjectTasks(projectId),
    queryKey: taskKeys.projectTasks(projectId),
  });
};

export const useCreateTask = () => {
  return useMutation({
    mutationFn: createTask,
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: updateTask,
  });
};

export const useReorderTasks = () => {
  return useMutation({
    mutationFn: reorderTasks,
  });
};

export const useSetTaskAssignee = () => {
  return useMutation({
    mutationFn: setTaskAssignee,
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: deleteTask,
  });
};

export const useCreateTaskAcceptanceCriterion = () => {
  return useMutation({
    mutationFn: createTaskAcceptanceCriterion,
  });
};

export const useUpdateTaskAcceptanceCriterion = () => {
  return useMutation({
    mutationFn: updateTaskAcceptanceCriterion,
  });
};

export const useDeleteTaskAcceptanceCriterion = () => {
  return useMutation({
    mutationFn: deleteTaskAcceptanceCriterion,
  });
};

export const useGetTaskComments = (
  projectId: number,
  taskId: number,
  enabled = true,
) => {
  return useQuery({
    enabled,
    queryFn: () => getTaskComments({ projectId, taskId }),
    queryKey: taskKeys.taskComments(projectId, taskId),
  });
};

export const useCreateTaskComment = () => {
  return useMutation({
    mutationFn: createTaskComment,
  });
};

export const useGetTaskActivities = (
  projectId: number,
  taskId: number,
  enabled = true,
) => {
  return useQuery({
    enabled,
    queryFn: () => getTaskActivities({ projectId, taskId }),
    queryKey: taskKeys.taskActivities(projectId, taskId),
  });
};
