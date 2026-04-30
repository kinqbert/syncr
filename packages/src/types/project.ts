export const ProjectStatus = {
  Active: "active",
  Paused: "paused",
  Completed: "completed",
  Archived: "archived",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export type Project = {
  id: number;
  name: string;
  description: string | null;
  managerId: number | null;
  companyId: number;
  projectStatus: ProjectStatus;
  startDate: string;
  endDate: string | null;
};

export type CreateProjectBody = {
  name: string;
  description?: string | null;
  managerId?: number | null;
  startDate: string;
  endDate?: string | null;
};

export type UpdateProjectBody = Partial<CreateProjectBody> & {
  projectStatus?: ProjectStatus;
};

export type ProjectManagerCandidate = {
  id: number;
  email: string;
  name: string;
  surname: string;
  roleKey: string;
  roleName: string;
};
