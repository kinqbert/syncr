import { projects } from "../../db/schema";
import { ProjectDto } from "./projects.dto";

type ProjectStats = {
  assignedPeopleCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
};

export const mapProjectToDto = (
  project: typeof projects.$inferSelect,
  stats?: Partial<ProjectStats>,
): ProjectDto => {
  return {
    id: project.id,
    name: project.name,
    managerId: project.managerId ?? null,
    companyId: project.companyId,
    status: project.status,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate ? project.endDate.toISOString() : null,
    assignedPeopleCount: stats?.assignedPeopleCount ?? 0,
    completedTasksCount: stats?.completedTasksCount ?? 0,
    totalTasksCount: stats?.totalTasksCount ?? 0,
  };
};
