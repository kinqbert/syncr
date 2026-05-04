import { Box, Stack, Typography } from "@mui/material";
import { useParams } from "react-router";

import { Kanban } from "./components/Kanban";

export const TasksPage = () => {
  const { projectId } = useParams();

  return (
    <Stack height="100%" minWidth={0} width="100%" sx={{ overflow: "hidden" }}>
      <Typography>TasksPage for project {projectId}</Typography>
      <Box minHeight={0} minWidth={0} sx={{ flex: 1, overflowX: "auto" }}>
        <Kanban projectId={Number(projectId)} />
      </Box>
    </Stack>
  );
};
