import { type TeamInvitation } from "./invitations";
import { type User } from "./user";

export type TeamUser = Pick<
  User,
  "id" | "email" | "name" | "surname" | "status"
> & {
  roleName: string;
  assignedTasks: number;
  completedTasks: number;
  workload: number;
};

export type TeamResponse = {
  totalMembers: number;
  activeProjects: number;
  averageWorkload: number;
  tasksCompleted: number;
  members: TeamUser[];
  invitations: TeamInvitation[];
};

export type TeamMember = {
  id: number;
  email: string;
  name: string;
  surname: string;
};
