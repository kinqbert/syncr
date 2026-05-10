import { InvitationStatus } from "@syncr/packages";
import { invitations, roles, users } from "src/db/schema";

import { TeamInvitationDto, TeamResponseDto, TeamUserDto } from "./team.dto";

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

type DbTeamInvitationsQueryData = {
  invitation: typeof invitations.$inferSelect;
  role: typeof roles.$inferSelect;
}[];

export const mapToTeamDataResponseDto = (
  usersData: DbTeamUserQueryData,
  tasksData: DbTeamTasksQueryData,
  invitationsData: DbTeamInvitationsQueryData,
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
  const averageWorkload = members.length > 0 ? workloadsSum / members.length : 0;

  const teamInvitations: TeamInvitationDto[] = invitationsData.map((invitation) => ({
    id: invitation.invitation.id,
    email: invitation.invitation.inviteeEmail,
    roleKey: invitation.role.key,
    roleName: invitation.role.name,
    status: invitation.invitation.status ?? InvitationStatus.Active,
  }));

  return {
    members,
    invitations: teamInvitations,
    averageWorkload,
    totalMembers: usersData.length,
    activeProjects: tasksData.activeProjects,
    tasksCompleted: tasksData.tasksCompleted,
  };
};
