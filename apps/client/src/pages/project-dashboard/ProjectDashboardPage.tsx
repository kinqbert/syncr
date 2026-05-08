import { Box, Stack, Typography } from "@mui/material";

import { useGetProject } from "@/api/projects";
import { ProjectViewNav } from "@/components/ProjectViewNav";
import { useProject } from "@/hooks";

import {
  ActivityTimeline,
  ProjectDashboardHeader,
  ProjectOverviewGrid,
} from "./components";

export const ProjectDashboardPage = () => {
  const { projectId } = useProject();
  const { data: project, isLoading: isProjectLoading } =
    useGetProject(projectId);

  return (
    <Box
      component="main"
      sx={{
        p: 3,
        width: "100%",
      }}
    >
      <Stack gap={3}>
        <Stack
          alignItems="center"
          direction={{ xs: "column", sm: "row" }}
          gap={2}
          justifyContent="space-between"
        >
          <Stack minWidth={0} gap={0.5}>
            <Typography variant="h4">
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
