export const ProjectStatus = {
  Active: "active",
  Paused: "paused",
  Completed: "completed",
  Archived: "archived",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
