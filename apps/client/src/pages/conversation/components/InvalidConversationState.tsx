import { Stack, Typography } from "@mui/material";

export const InvalidConversationState = () => {
  return (
    <Stack
      width="100%"
      height="100%"
      p={3}
      alignItems="center"
      justifyContent="center"
    >
      <Typography color="text.secondary">Invalid conversation.</Typography>
    </Stack>
  );
};
