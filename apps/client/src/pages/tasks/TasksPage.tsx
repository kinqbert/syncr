import { Box, Stack, Typography } from "@mui/material";
import { useParams } from "react-router";

import { useGetProject } from "@/api/project";

import { Kanban } from "./components/Kanban";

export const TasksPage = () => {
  const { projectId } = useParams();

  const { data: project } = useGetProject(Number(projectId));

  if (!projectId) {
    return null;
  }

  return (
    <Stack height="100%" minWidth={0} width="100%" p={3}>
      <Stack mb={2}>
        <Typography variant="h5">{project?.name}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Drag and drop tasks to update their status
        </Typography>
      </Stack>
      <Box minHeight={0} minWidth={0} sx={{ flex: 1, overflowX: "scroll" }}>
        <Kanban projectId={Number(projectId)} />
      </Box>
    </Stack>
  );
};
