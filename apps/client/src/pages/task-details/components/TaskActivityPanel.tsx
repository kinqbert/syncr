import { Box, Stack, Typography } from "@mui/material";

import { Panel } from "../../../components/Panel";

const activityItems = [
  "Task details opened",
  "Description ready for edits",
  "Task created",
];

export const TaskActivityPanel = () => {
  return (
    <Panel>
      <Stack gap={2}>
        <Typography variant="subtitle1">Activity</Typography>
        {activityItems.map((activity) => (
          <Stack direction="row" gap={1.25} key={activity}>
            <Box
              sx={{
                bgcolor: "primary.main",
                borderRadius: "50%",
                height: 6,
                mt: 0.75,
                width: 6,
              }}
            />
            <Stack>
              <Typography variant="body2">{activity}</Typography>
              <Typography color="text.secondary" variant="caption">
                Recently
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Panel>
  );
};
