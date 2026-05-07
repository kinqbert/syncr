import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  CircularProgress,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router";

import { useGetProjectAssignees, useGetProjectLabels } from "@/api/projects";
import { useGetProjectTasks } from "@/api/tasks";

import { TaskActivityPanel } from "./components/TaskActivityPanel";
import { TaskAttachmentsPanel } from "./components/TaskAttachmentsPanel";
import { TaskCommentsPanel } from "./components/TaskCommentsPanel";
import { TaskDetailsPanel } from "./components/TaskDetailsPanel";
import { TaskOverviewPanel } from "./components/TaskOverviewPanel";

export const TaskDetailsPage = () => {
  const { projectId, taskId } = useParams();
  const numericProjectId = Number(projectId);
  const numericTaskId = Number(taskId);
  const { data: tasks = [], isPending } = useGetProjectTasks(
    numericProjectId,
    Boolean(projectId),
  );
  const { data: projectAssignees = [], isPending: areAssigneesPending } =
    useGetProjectAssignees(numericProjectId, Boolean(projectId));
  const { data: projectLabels = [], isPending: areLabelsPending } =
    useGetProjectLabels(numericProjectId, Boolean(projectId));
  const task = tasks.find((item) => item.id === numericTaskId);

  if (!projectId || !taskId) {
    return null;
  }

  if (isPending) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="100%">
        <CircularProgress />
      </Stack>
    );
  }

  if (!task) {
    return (
      <Stack gap={2} p={3}>
        <MuiLink component={Link} to={`/projects/${projectId}/tasks`}>
          Back to Task Board
        </MuiLink>
        <Typography variant="h5">Task could not be found</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      gap={3}
      p={3}
      sx={{
        bgcolor: "background.default",
        height: "100%",
        overflow: "auto",
      }}
    >
      <MuiLink
        component={Link}
        to={`/projects/${projectId}/tasks`}
        underline="none"
        sx={{ alignItems: "center", display: "inline-flex", gap: 0.75 }}
      >
        <ArrowBackIcon fontSize="small" />
        Back to Task Board
      </MuiLink>

      <Box
        sx={{
          alignItems: "flex-start",
          display: "grid",
          gap: 2.25,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1fr) 420px",
          },
        }}
      >
        <Stack gap={2.25} minWidth={0}>
          <TaskOverviewPanel projectId={numericProjectId} task={task} />

          <TaskAttachmentsPanel />

          <TaskCommentsPanel projectId={numericProjectId} taskId={task.id} />
        </Stack>

        <Stack gap={2.25} minWidth={0}>
          <TaskDetailsPanel
            isAssigneesPending={areAssigneesPending}
            isLabelsPending={areLabelsPending}
            projectId={numericProjectId}
            projectAssignees={projectAssignees}
            projectLabels={projectLabels}
            task={task}
          />

          <TaskActivityPanel />
        </Stack>
      </Box>
    </Stack>
  );
};
