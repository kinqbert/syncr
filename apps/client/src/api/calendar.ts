import { type CalendarConnection, CalendarProvider } from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { env } from "@/lib/env";
import { queryClient } from "@/lib/react-query";

export const calendarKeys = {
  all: ["calendar-connections"] as const,
};

const getCalendarConnections = async () => {
  const response = await api.get<CalendarConnection[]>("calendar-connections");

  return response.data;
};

const disconnectCalendar = async (provider: CalendarProvider) => {
  await api.delete(`calendar-connections/${provider}`);
};

export const getCalendarConnectUrl = (provider: CalendarProvider) => {
  return `${(env.apiUrl ?? "").replace(/\/$/, "")}/calendar-connections/${provider}/connect`;
};

export const useCalendarConnections = () => {
  return useQuery({
    queryKey: calendarKeys.all,
    queryFn: getCalendarConnections,
  });
};

export const useDisconnectCalendar = () => {
  return useMutation({
    mutationFn: disconnectCalendar,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
};

export { CalendarProvider };
