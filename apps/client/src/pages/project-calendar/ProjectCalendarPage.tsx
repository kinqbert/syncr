import { Stack, Typography } from "@mui/material";

import { useGetProject } from "@/api/projects";
import { useGetProjectTasks } from "@/api/tasks";
import { TaskDeadlineCalendar } from "@/components/calendar";
import { ProjectViewNav } from "@/components/ProjectViewNav";
import { useProject } from "@/hooks";

import { toProjectTaskEvents } from "./utils/toProjectTaskEvents";

export const ProjectCalendarPage = () => {
  const { projectId } = useProject();
  const { data: project, isLoading: isProjectLoading } =
    useGetProject(projectId);
  const { data: tasks = [], isLoading: areTasksLoading } =
    useGetProjectTasks(projectId);

  const events = toProjectTaskEvents(tasks);
  const isLoading = isProjectLoading || areTasksLoading;

  return (
    <Stack
      height="100%"
      minWidth={0}
      p={{ xs: 2, sm: 3 }}
      width="100%"
    >
      <Stack
        alignItems={{ xs: "stretch", lg: "center" }}
        direction={{ xs: "column", lg: "row" }}
        gap={2}
        justifyContent="space-between"
        mb={{ xs: 2, sm: 3 }}
      >
        <Stack minWidth={0} gap={0.5}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: 28, sm: 34 }, lineHeight: 1.2 }}
          >
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
