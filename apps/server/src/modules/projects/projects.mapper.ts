import { projects } from "src/db/schema";

import { ProjectDto } from "./projects.dto";

export const mapProjectToDto = (project: typeof projects.$inferSelect): ProjectDto => {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    managerId: project.managerId ?? null,
    companyId: project.companyId,
    status: project.status,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate ? project.endDate.toISOString() : null,
  };
};
