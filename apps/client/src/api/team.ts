import { type TeamResponse } from "@syncr/packages";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export const teamKeys = {
  team: ["team"],
};

const getTeamData = async () => {
  const response = await api.get<TeamResponse>("team");

  return response.data;
};

export const useGetTeam = () => {
  return useQuery({
    queryFn: getTeamData,
    queryKey: teamKeys.team,
  });
};
