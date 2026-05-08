import { roles, users } from "src/db/schema";

import { TeamResponseDto, TeamUserDto } from "./team.dto";

type DbTeamUserQueryData = {
  user: typeof users.$inferSelect;
  role: typeof roles.$inferSelect;
  assignedTasks: number;
  completedTasks: number;
  assignedTasksWorkloadMinutes: number;
}[];

type DbTeamTasksQueryData = {
  activeProjects: number;
  tasksCompleted: number;
};

export const mapToTeamDataResponseDto = (
  usersData: DbTeamUserQueryData,
  tasksData: DbTeamTasksQueryData,
): TeamResponseDto => {
  const members: TeamUserDto[] = usersData.map((user) => ({
    id: user.user.id,
    email: user.user.email,
    name: user.user.name,
    surname: user.user.surname,
    status: user.user.status,
    roleName: user.role.name,
    assignedTasks: user.assignedTasks,
    completedTasks: user.completedTasks,
    workload: Math.min(1, user.assignedTasksWorkloadMinutes / user.user.weeklyLoadMinutes),
  }));

  const workloadsSum = members.reduce((acc, member) => acc + member.workload, 0);
  const averageWorkload = workloadsSum / members.length;

  return {
    members,
    averageWorkload,
    totalMembers: usersData.length,
    activeProjects: tasksData.activeProjects,
    tasksCompleted: tasksData.tasksCompleted,
  };
};
