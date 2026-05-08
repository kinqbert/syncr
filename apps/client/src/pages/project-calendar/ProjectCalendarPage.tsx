import type { EventInput } from "@fullcalendar/core";
import { Button, Stack, Typography } from "@mui/material";
import type { Task } from "@syncr/packages";
import { Columns3 } from "lucide-mui";
import { Link } from "react-router";

import { useGetProject } from "@/api/projects";
import { useGetProjectTasks } from "@/api/tasks";
import { TaskDeadlineCalendar } from "@/components/calendar";
import { useProject } from "@/hooks";
import { getPriorityEventClassName, toCalendarDate } from "@/utils/calendar";

const toTaskEvents = (tasks: Task[], projectId: number): EventInput[] => {
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
        meta: task.assignee
          ? `${task.assignee.name} ${task.assignee.surname}`
          : "Unassigned",
      },
      id: String(task.id),
      start,
      title: task.name,
      url: `/projects/${projectId}/tasks/${task.id}`,
    });

    return events;
  }, []);
};

export const ProjectCalendarPage = () => {
  const { projectId } = useProject();
  const { data: project, isLoading: isProjectLoading } =
    useGetProject(projectId);
  const { data: tasks = [], isLoading: areTasksLoading } =
    useGetProjectTasks(projectId);

  const events = toTaskEvents(tasks, projectId);
  const isLoading = isProjectLoading || areTasksLoading;

  return (
    <Stack height="100%" minWidth={0} p={3} width="100%">
      <Stack
        alignItems={{ xs: "flex-start", sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        gap={2}
        justifyContent="space-between"
        mb={2}
      >
        <Stack minWidth={0}>
          <Typography variant="h5">
            {project ? `${project.name} calendar` : "Project calendar"}
          </Typography>
          <Typography color="text.secondary" variant="subtitle1">
            See every task deadline placed on the day it is due.
          </Typography>
        </Stack>
        <Button
          component={Link}
          startIcon={<Columns3 />}
          sx={{ whiteSpace: "nowrap" }}
          to={`/projects/${projectId}/tasks`}
          variant="outlined"
        >
          Task board
        </Button>
      </Stack>

      <TaskDeadlineCalendar events={events} isLoading={isLoading} />
    </Stack>
  );
};
