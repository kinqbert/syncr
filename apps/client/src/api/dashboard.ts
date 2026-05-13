import type { DashboardData } from "@syncr/packages";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export const dashboardKeys = {
  dashboard: ["dashboard"],
};

const getDashboard = async () => {
  const response = await api.get<DashboardData>("dashboard");

  return response.data;
};

export const useGetDashboard = () => {
  return useQuery({
    queryFn: getDashboard,
    queryKey: dashboardKeys.dashboard,
  });
};
