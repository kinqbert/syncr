import type {
  CreateTaskBody,
  ReorderTasksBody,
  Task,
  UpdateTaskBody,
} from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export const taskKeys = {
  projectTasks: (projectId: number) =>
    ["projects", projectId, "tasks"] as const,
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

const deleteTask = async ({
  projectId,
  taskId,
}: {
  projectId: number;
  taskId: number;
}) => {
  await api.delete(`projects/${projectId}/tasks/${taskId}`);
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

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: deleteTask,
  });
};
