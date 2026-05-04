import { tasks } from "src/db/schema";

import { TaskDto } from "./task.dto";

export const mapTaskToDto = (task: typeof tasks.$inferSelect): TaskDto => {
  return {
    id: task.id,
    name: task.name,
    description: task.description,
    projectId: task.projectId,
    assigneeId: task.assigneeId,
    status: task.status,
    priority: task.priority,
    position: task.position,
    endDate: task.endDate ? task.endDate.toISOString() : null,
  };
};
