import { Stack, Typography } from "@mui/material";

import { useGetMyAssignedTasks } from "@/api/tasks";
import { TaskDeadlineCalendar } from "@/components/calendar";

import { toUserTaskEvents } from "./utils/toUserTaskEvents";

export const MyCalendarPage = () => {
  const { data: tasks = [], isLoading } = useGetMyAssignedTasks();
  const events = toUserTaskEvents(tasks);

  return (
    <Stack height="100%" minWidth={0} p={3} width="100%">
      <Stack mb={3} minWidth={0} gap={0.5}>
        <Typography variant="h4">My calendar</Typography>
        <Typography color="text.secondary">
          All tasks assigned to you across projects, placed on their deadline.
        </Typography>
      </Stack>

      <TaskDeadlineCalendar events={events} isLoading={isLoading} />
    </Stack>
  );
};
