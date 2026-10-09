import { Box, Button, Stack } from "@mui/material";
import { Link, useParams } from "react-router";

import {
  useGetProject,
  useGetProjectAssignees,
  useGetProjectLabels,
} from "@/api/projects";
import { useGetProjectTasks } from "@/api/tasks";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState, Page, PageHeader, PageSkeleton } from "@/components/ui";

import { TaskActivityPanel } from "./components/TaskActivityPanel";
import { TaskCommentsPanel } from "./components/TaskCommentsPanel";
import { TaskDetailsPanel } from "./components/TaskDetailsPanel";
import { TaskOverviewPanel } from "./components/TaskOverviewPanel";

export const TaskDetailsPage = () => {
  const { projectId, taskId } = useParams();
  const numericProjectId = Number(projectId);
  const numericTaskId = Number(taskId);
  const {
    data: tasks = [],
    error: tasksError,
    isError: areTasksError,
    isPending,
  } = useGetProjectTasks(numericProjectId, Boolean(projectId));
  const {
    data: projectAssignees = [],
    error: assigneesError,
    isError: areAssigneesError,
    isPending: areAssigneesPending,
  } = useGetProjectAssignees(numericProjectId, Boolean(projectId));
  const {
    data: projectLabels = [],
    error: labelsError,
    isError: areLabelsError,
    isPending: areLabelsPending,
  } = useGetProjectLabels(numericProjectId, Boolean(projectId));
  const { data: project } = useGetProject(numericProjectId, Boolean(projectId));
  const task = tasks.find((item) => item.id === numericTaskId);

  if (!projectId || !taskId) {
    return null;
  }

  if (areTasksError || areAssigneesError || areLabelsError) {
    return (
      <ErrorState
        error={tasksError ?? assigneesError ?? labelsError}
        fallback="Could not load task details."
        title="Could not load task details."
      />
    );
  }

  const breadcrumbs = [
    { label: "Projects", to: "/projects" },
    { label: project?.name ?? "Project", to: `/projects/${projectId}` },
    { label: "Board", to: `/projects/${projectId}/tasks` },
  ];

  if (isPending) {
    return <PageSkeleton />;
  }

  if (!task) {
    return (
      <Page maxWidth={1240}>
        <PageHeader breadcrumbs={breadcrumbs} title="Task not found" />
        <EmptyState
          action={
            <Button
              component={Link}
              to={`/projects/${projectId}/tasks`}
              variant="outlined"
            >
              Back to board
            </Button>
          }
          description="It may have been deleted or moved to another project."
          title="This task doesn't exist"
        />
      </Page>
    );
  }

  return (
    <Page maxWidth={1240}>
      <PageHeader breadcrumbs={[...breadcrumbs, { label: `#${task.id}` }]} />

      <Box
        sx={{
          alignItems: "flex-start",
          display: "grid",
          gap: { xs: 2.5, lg: 4 },
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1fr) 320px",
          },
        }}
      >
        <Stack gap={3} minWidth={0} sx={{ order: { xs: 2, lg: 1 } }}>
          <TaskOverviewPanel task={task} />
          <TaskCommentsPanel taskId={task.id} />
          <TaskActivityPanel taskId={task.id} />
        </Stack>

        <Box
          sx={{
            order: { xs: 1, lg: 2 },
            position: { lg: "sticky" },
            top: { lg: 24 },
          }}
        >
          <TaskDetailsPanel
            isAssigneesPending={areAssigneesPending}
            isLabelsPending={areLabelsPending}
            projectAssignees={projectAssignees}
            projectLabels={projectLabels}
            task={task}
          />
        </Box>
      </Box>
    </Page>
  );
};
