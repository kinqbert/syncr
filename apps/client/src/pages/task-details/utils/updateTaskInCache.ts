import type { Task } from "@syncr/packages";

import { taskKeys } from "@/api/tasks";
import { queryClient } from "@/lib/react-query";

export const updateTaskInCache = (projectId: number, updatedTask: Task) => {
  queryClient.setQueryData<Task[]>(
    taskKeys.projectTasks(projectId),
    (tasks = []) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
  );
};
