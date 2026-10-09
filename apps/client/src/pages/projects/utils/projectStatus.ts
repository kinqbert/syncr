import type { Project, ProjectStatus } from "@syncr/packages";

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
};

export const getProjectProgress = (project: Project) =>
  project.totalTasksCount > 0
    ? Math.round((project.completedTasksCount / project.totalTasksCount) * 100)
    : 0;
