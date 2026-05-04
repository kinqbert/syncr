import type {
  CreateTaskBody,
  ReorderTasksBody,
  Task,
  UpdateTaskBody,
  UpdateTaskStatusBody,
} from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export const taskKeys = {
  projectTasks: (projectId: number) => ["project", projectId, "tasks"] as const,
};

const getProjectTasks = async (projectId: number) => {
  const response = await api.get<Task[]>(`project/${projectId}/tasks`);

  return response.data;
};

const createTask = async ({
  projectId,
  body,
}: {
  projectId: number;
  body: CreateTaskBody;
}) => {
  const response = await api.post<Task>(`project/${projectId}/tasks`, body);

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
    `project/${projectId}/tasks/${taskId}`,
    body,
  );

  return response.data;
};

const updateTaskStatus = async ({
  projectId,
  taskId,
  body,
}: {
  projectId: number;
  taskId: number;
  body: UpdateTaskStatusBody;
}) => {
  const response = await api.patch<Task>(
    `project/${projectId}/tasks/${taskId}/status`,
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
    `project/${projectId}/tasks/reorder`,
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
  await api.delete(`project/${projectId}/tasks/${taskId}`);
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

export const useUpdateTaskStatus = () => {
  return useMutation({
    mutationFn: updateTaskStatus,
  });
};

export const useReorderTasks = () => {
  return useMutation({
    mutationFn: reorderTasks,
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: deleteTask,
  });
};
