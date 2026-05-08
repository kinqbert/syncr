import { type RoleKey } from "./role";
import { type User } from "./user";

export type TeamUser = Pick<
  User,
  "id" | "email" | "name" | "surname" | "status"
> & {
  role: RoleKey;
  assignedTasks: number;
  completedTasks: number;
  workload: number;
};
