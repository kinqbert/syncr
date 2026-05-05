import { TaskDto } from "./tasks.dto";

type TaskRecord = {
  id: number;
  name: string;
  description: string;
  projectId: number;
  assignee: {
    id: number;
    email: string;
    name: string;
    surname: string;
  };
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
    assignee: task.assignee,
    status: task.status,
    priority: task.priority,
    position: task.position,
    endDate: task.endDate ? task.endDate.toISOString() : null,
  };
};
