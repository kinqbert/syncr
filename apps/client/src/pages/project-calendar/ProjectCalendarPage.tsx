import type { EventInput } from "@fullcalendar/core";
import { Stack, Typography } from "@mui/material";
import type { Task } from "@syncr/packages";

import { useGetProject } from "@/api/projects";
import { useGetProjectTasks } from "@/api/tasks";
import { TaskDeadlineCalendar } from "@/components/calendar";
import { ProjectViewNav } from "@/components/ProjectViewNav";
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
    <Stack
      height="100%"
      minWidth={0}
      p={3}
      width="100%"
    >
      <Stack
        alignItems={{ xs: "flex-start", sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        gap={2}
        justifyContent="space-between"
        mb={2}
      >
        <Stack minWidth={0} gap={0.5}>
          <Typography variant="h4">
            {project ? `${project.name}` : "Project calendar"}
          </Typography>
          <Typography color="text.secondary">
            See every task deadline placed on the day it is due.
          </Typography>
        </Stack>
        <ProjectViewNav projectId={projectId} />
      </Stack>

      <TaskDeadlineCalendar events={events} isLoading={isLoading} />
    </Stack>
  );
};
