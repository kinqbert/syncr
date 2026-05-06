import { TaskDto } from "./tasks.dto";

type TaskRecord = {
  id: number;
  name: string;
  description: string;
  projectId: number;
  assignee: {
    id: number | null;
    email: string | null;
    name: string | null;
    surname: string | null;
  } | null;
  status: TaskDto["status"];
  priority: TaskDto["priority"];
  position: number;
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
    status: task.status,
    priority: task.priority,
    position: task.position,
    endDate: task.endDate ? task.endDate.toISOString() : null,
  };
};
