import { Alert, Box, Skeleton, Stack } from "@mui/material";
import { TaskStatus } from "@syncr/packages";

import { useGetProject, useGetProjectAssignees } from "@/api/projects";
import { useGetProjectTasks } from "@/api/tasks";
import { ErrorState } from "@/components/ErrorState";
import { ProjectPageHeader } from "@/components/ProjectPageHeader";
import { StatusDistribution } from "@/components/StatusDistribution";
import { EmptyState, Page } from "@/components/ui";
import { useProject } from "@/hooks";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { ActivityTimeline, ProjectSummary, TeamMembersCard } from "./components";

const STATUS_ORDER = Object.values(TaskStatus);

export const ProjectDashboardPage = () => {
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
  const { data: members = [], isLoading: areMembersLoading } =
    useGetProjectAssignees(projectId);

  if (isProjectError) {
    return (
      <ErrorState
        error={projectError}
        fallback="Could not load project dashboard."
        title="Could not load project dashboard."
      />
    );
  }

  const isLoading = isProjectLoading || areTasksLoading || areMembersLoading;
  const statusPoints = STATUS_ORDER.map((status) => ({
    status,
    value: tasks.filter((task) => task.status === status).length,
  }));

  return (
    <Page maxWidth={1400}>
      <ProjectPageHeader
        isLoading={isProjectLoading}
        project={project}
        projectId={projectId}
      />

      {isLoading ? (
        <PageSkeletonBody />
      ) : !project ? (
        <EmptyState
          description="It may have been removed or you no longer have access."
          title="Project not found"
        />
      ) : (
        <>
          {areTasksError ? (
            <Alert severity="error">
              {getErrorMessage(tasksError, "Could not load project tasks.")}
            </Alert>
          ) : (
            <ProjectSummary members={members} project={project} tasks={tasks} />
          )}

          <Box
            sx={{
              alignItems: "start",
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                lg: "minmax(0, 2fr) minmax(0, 1fr)",
              },
            }}
          >
            <Stack gap={2} minWidth={0}>
              <StatusDistribution
                data={statusPoints}
                description={`${tasks.length} tasks in this project`}
              />
              <ActivityTimeline projectId={projectId} projectName={project.name} />
            </Stack>
            <TeamMembersCard projectId={projectId} tasks={tasks} />
          </Box>
        </>
      )}
    </Page>
  );
};

const PageSkeletonBody = () => (
  <Stack gap={2}>
    <Skeleton height={84} variant="rounded" />
    <Stack direction={{ xs: "column", lg: "row" }} gap={2}>
      <Skeleton height={240} sx={{ flex: 2 }} variant="rounded" />
      <Skeleton height={240} sx={{ flex: 1 }} variant="rounded" />
    </Stack>
  </Stack>
);
