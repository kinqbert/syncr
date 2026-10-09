import { useGetProject } from "@/api/projects";
import { useGetProjectTasks } from "@/api/tasks";
import { TaskDeadlineCalendar } from "@/components/calendar";
import { ErrorState } from "@/components/ErrorState";
import { ProjectPageHeader } from "@/components/ProjectPageHeader";
import { Page } from "@/components/ui";
import { useProject } from "@/hooks";

import { toProjectTaskEvents } from "./utils/toProjectTaskEvents";

export const ProjectCalendarPage = () => {
  const { projectId } = useProject();
  const {
    data: project,
    error: projectError,
    isError: isProjectError,
    isLoading: isProjectLoading,
  } = useGetProject(projectId);
  const {
    data: tasks = [],
    error: tasksError,
    isError: areTasksError,
    isLoading: areTasksLoading,
  } = useGetProjectTasks(projectId);

  const events = toProjectTaskEvents(tasks);
  const isLoading = isProjectLoading || areTasksLoading;

  if (isProjectError || areTasksError) {
    return (
      <ErrorState
        error={projectError ?? tasksError}
        fallback="Could not load project calendar."
        title="Could not load project calendar."
      />
    );
  }

  return (
    <Page sx={{ height: "100%" }}>
      <ProjectPageHeader
        isLoading={isProjectLoading}
        project={project}
        projectId={projectId}
      />
      <TaskDeadlineCalendar events={events} isLoading={isLoading} />
    </Page>
  );
};
