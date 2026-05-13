import { Avatar, Stack, Typography } from "@mui/material";
import { MessageCircle } from "lucide-mui";

export const ConversationEmptyPage = () => {
  return (
    <Stack
      width="100%"
      height="100%"
      p={3}
      gap={1}
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: "background.default" }}
    >
      <Avatar
        sx={{
          bgcolor: "#EEF2FF",
          color: "primary.main",
          height: 56,
          width: 56,
        }}
      >
        <MessageCircle />
      </Avatar>
      <Typography fontWeight={800} variant="h5">
        Select a chat
      </Typography>
      <Typography color="text.secondary">
        Choose a conversation or create a new one.
      </Typography>
    </Stack>
  );
};
