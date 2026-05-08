import type { EventInput } from "@fullcalendar/core";
import { Stack, Typography } from "@mui/material";
import type { AssignedTask } from "@syncr/packages";

import { useGetMyAssignedTasks } from "@/api/tasks";
import { TaskDeadlineCalendar } from "@/components/calendar";
import { getPriorityEventClassName, toCalendarDate } from "@/utils/calendar";

const toTaskEvents = (tasks: AssignedTask[]): EventInput[] => {
  return tasks.reduce<EventInput[]>((events, task) => {
    if (!task.endDate) {
      return events;
    }

    const start = toCalendarDate(task.endDate);

    if (!start) {
      return events;
    }

    events.push({
      allDay: true,
      classNames: [getPriorityEventClassName(task.priority)],
      extendedProps: {
        meta: task.project.name,
      },
      id: String(task.id),
      start,
      title: task.name,
      url: `/projects/${task.projectId}/tasks/${task.id}`,
    });

    return events;
  }, []);
};

export const UserCalendarPage = () => {
  const { data: tasks = [], isLoading } = useGetMyAssignedTasks();
  const events = toTaskEvents(tasks);

  return (
    <Stack
      height="100%"
      minWidth={0}
      p={3}
      width="100%"
    >
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
