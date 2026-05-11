import { Stack, Typography } from "@mui/material";

export const ConversationEmptyPage = () => {
  return (
    <Stack
      width="100%"
      height="100%"
      p={3}
      gap={0.5}
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4">Select a conversation</Typography>
      <Typography color="text.secondary">aaaaa</Typography>
    </Stack>
  );
};
