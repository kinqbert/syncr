import { Box, Stack } from "@mui/material";

import { useProject } from "@/hooks";

import {
  ActivityTimeline,
  ProjectDashboardHeader,
  ProjectOverviewGrid,
} from "./components";

export const ProjectDashboardPage = () => {
  const { projectId } = useProject();

  return (
    <Box
      component="main"
      sx={{ height: "100%", overflow: "auto", p: 3, width: "100%" }}
    >
      <Stack gap={3}>
        <ProjectDashboardHeader projectId={projectId} />

        <ProjectOverviewGrid projectId={projectId} />

        <ActivityTimeline projectId={projectId} />
      </Stack>
    </Box>
  );
};
