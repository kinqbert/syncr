import type {
  CreateTaskAcceptanceCriterionBody,
  CreateTaskBody,
  CreateTaskCommentBody,
  ReorderTasksBody,
  Task,
  TaskActivitiesPage,
  TaskComment,
  UpdateTaskAcceptanceCriterionBody,
  UpdateTaskBody,
} from "@syncr/packages";
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import api from "@/lib/axios";
import { queryClient } from "@/lib/react-query";

export const taskKeys = {
  all: ["tasks"] as const,

  project: (projectId: number) =>
    [...taskKeys.all, "project", projectId] as const,

  lists: (projectId: number) =>
    [...taskKeys.project(projectId), "list"] as const,

  detail: (projectId: number, taskId: number) =>
    [...taskKeys.project(projectId), taskId] as const,

  comments: (projectId: number, taskId: number) =>
    [...taskKeys.detail(projectId, taskId), "comments"] as const,

  activities: (projectId: number, taskId: number) =>
    [...taskKeys.detail(projectId, taskId), "activities"] as const,
};

// HELPERS

const handleTaskMutationSuccess = ({
  updatedTask,
  projectId,
  taskId,
}: {
  updatedTask: Task;
  projectId: number;
  taskId: number;
}) => {
  queryClient.setQueryData<Task[]>(taskKeys.lists(projectId), (tasks = []) =>
    tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
  );

  void queryClient.invalidateQueries({
    queryKey: taskKeys.activities(projectId, taskId),
  });
};

// API CALLS

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
  limit,
  offset,
}: {
  projectId: number;
  taskId: number;
  limit: number;
  offset: number;
}) => {
  const response = await api.get<TaskActivitiesPage>(
    `projects/${projectId}/tasks/${taskId}/activities`,
    {
      params: { limit, offset },
    },
  );

  return response.data;
};

const invalidateProjectLabels = (projectId: number) => {
  void queryClient.invalidateQueries({
    queryKey: ["projects", projectId, "labels"] as const,
  });
};

const invalidateProjectSummaries = () => {
  void queryClient.invalidateQueries({ queryKey: ["projects"] as const });
};

export const useGetProjectTasks = (projectId: number, enabled = true) => {
  return useQuery({
    enabled,
    queryFn: () => getProjectTasks(projectId),
    queryKey: taskKeys.lists(projectId),
  });
};

export const useCreateTask = () => {
  return useMutation({
    mutationFn: createTask,
    onSuccess: (_task, { projectId }) => {
      void queryClient.invalidateQueries({
        queryKey: taskKeys.lists(projectId),
      });
      invalidateProjectSummaries();
    },
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask, { projectId, taskId, body }) => {
      handleTaskMutationSuccess({
        updatedTask,
        projectId: projectId,
        taskId: taskId,
      });

      if (body.labelNames) {
        invalidateProjectLabels(projectId);
      }

      invalidateProjectSummaries();
    },
  });
};

export const useReorderTasks = () => {
  return useMutation({
    mutationFn: reorderTasks,
    onSuccess: (tasks, variables) => {
      queryClient.setQueryData(taskKeys.lists(variables.projectId), tasks);
    },
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Task[]>(
        taskKeys.lists(variables.projectId),
        (tasks = []) => tasks.filter((task) => task.id !== variables.taskId),
      );

      queryClient.removeQueries({
        queryKey: taskKeys.detail(variables.projectId, variables.taskId),
      });
      invalidateProjectSummaries();
    },
  });
};

export const useCreateTaskAcceptanceCriterion = () => {
  return useMutation({
    mutationFn: createTaskAcceptanceCriterion,
    onSuccess: (updatedTask, variables) => {
      handleTaskMutationSuccess({
        updatedTask,
        projectId: variables.projectId,
        taskId: variables.taskId,
      });
    },
  });
};

export const useUpdateTaskAcceptanceCriterion = () => {
  return useMutation({
    mutationFn: updateTaskAcceptanceCriterion,
    onSuccess: (updatedTask, variables) => {
      handleTaskMutationSuccess({
        updatedTask,
        projectId: variables.projectId,
        taskId: variables.taskId,
      });
    },
  });
};

export const useDeleteTaskAcceptanceCriterion = () => {
  return useMutation({
    mutationFn: deleteTaskAcceptanceCriterion,
    onSuccess: (updatedTask, variables) => {
      handleTaskMutationSuccess({
        updatedTask,
        projectId: variables.projectId,
        taskId: variables.taskId,
      });
    },
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
    queryKey: taskKeys.comments(projectId, taskId),
  });
};

export const useCreateTaskComment = () => {
  return useMutation({
    mutationFn: createTaskComment,
    onSuccess: (createdComment, { projectId, taskId }) => {
      queryClient.setQueryData<TaskComment[]>(
        taskKeys.comments(projectId, taskId),
        (currentComments = []) => [...currentComments, createdComment],
      );
      queryClient.invalidateQueries({
        queryKey: taskKeys.activities(projectId, taskId),
      });
    },
  });
};

export const useGetTaskActivities = (
  projectId: number,
  taskId: number,
  limit: number,
  enabled = true,
) => {
  return useInfiniteQuery<
    TaskActivitiesPage,
    Error,
    InfiniteData<TaskActivitiesPage>,
    ReturnType<typeof taskKeys.activities>,
    number
  >({
    enabled,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore
        ? pages.reduce((count, page) => count + page.items.length, 0)
        : undefined,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getTaskActivities({ projectId, taskId, limit, offset: pageParam }),
    queryKey: taskKeys.activities(projectId, taskId),
  });
};
