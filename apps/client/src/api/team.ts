import { type TeamMember, type TeamResponse } from "@syncr/packages";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export const teamKeys = {
  team: ["team"],
  teamMembers: ["team-members"],
};

const getTeamData = async () => {
  const response = await api.get<TeamResponse>("team");

  return response.data;
};

const getTeamMembersData = async () => {
  const response = await api.get<TeamMember[]>("team/members");

  return response.data;
};

export const useGetTeam = () => {
  return useQuery({
    queryFn: getTeamData,
    queryKey: teamKeys.team,
  });
};

export const useGetTeamMembers = () => {
  return useQuery({
    queryFn: getTeamMembersData,
    queryKey: teamKeys.teamMembers,
  });
};
