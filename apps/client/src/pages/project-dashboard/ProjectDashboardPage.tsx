import { Box, Stack, Typography } from "@mui/material";

import { useGetProject } from "@/api/projects";
import { ErrorState } from "@/components/ErrorState";
import { ProjectViewNav } from "@/components/ProjectViewNav";
import { useProject } from "@/hooks";

import {
  ActivityTimeline,
  ProjectDashboardHeader,
  ProjectOverviewGrid,
} from "./components";

export const ProjectDashboardPage = () => {
  const { projectId } = useProject();
  const {
    data: project,
    error: projectError,
    isError: isProjectError,
    isLoading: isProjectLoading,
  } = useGetProject(projectId);

  if (isProjectError) {
    return (
      <ErrorState
        error={projectError}
        fallback="Could not load project dashboard."
        title="Could not load project dashboard."
      />
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minWidth: 0,
        p: { xs: 2, sm: 3 },
        width: "100%",
      }}
    >
      <Stack gap={{ xs: 2.5, sm: 3 }} minWidth={0}>
        <Stack
          alignItems={{ xs: "stretch", lg: "center" }}
          direction={{ xs: "column", lg: "row" }}
          gap={2}
          justifyContent="space-between"
        >
          <Stack minWidth={0} gap={0.5}>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: 28, sm: 34 }, lineHeight: 1.2 }}
            >
              {project?.name ?? "Project dashboard"}
            </Typography>
            <Typography color="text.secondary">
              Project dashboard, task progress, and team workload
            </Typography>
          </Stack>

          <ProjectViewNav projectId={projectId} />
        </Stack>

        <ProjectDashboardHeader
          project={project}
          isProjectLoading={isProjectLoading}
        />

        {!isProjectLoading && project ? (
          <>
            <ProjectOverviewGrid projectId={projectId} />
            <ActivityTimeline projectId={projectId} />
          </>
        ) : null}

        {!isProjectLoading && !project ? (
          <Stack alignItems="center" py={6}>
            <Typography color="text.secondary">Project not found.</Typography>
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};
