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
  status: ProjectStatus;
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
  status?: ProjectStatus;
};

export type ProjectManagerCandidate = {
  id: number;
  email: string;
  name: string;
  surname: string;
  roleKey: string;
  roleName: string;
};

export type ProjectAssignee = {
  id: number;
  email: string;
  name: string;
  surname: string;
};

export type ProjectLabel = {
  id: number;
  projectId: number;
  name: string;
};

export type ProjectMemberCandidate = ProjectAssignee & {
  roleKey: string;
  roleName: string;
};

export type AddProjectMemberBody = {
  userId: number;
};
