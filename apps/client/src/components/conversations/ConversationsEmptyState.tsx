import { Avatar, Stack, Typography } from "@mui/material";
import { Users } from "lucide-mui";

export const ConversationsEmptyState = () => {
  return (
    <Stack
      alignItems="center"
      gap={1}
      justifyContent="center"
      px={2}
      py={5}
      textAlign="center"
    >
      <Avatar
        sx={{
          bgcolor: "#EEF2FF",
          color: "primary.main",
          height: 44,
          width: 44,
        }}
      >
        <Users fontSize="small" />
      </Avatar>
      <Typography color="text.secondary" variant="body2">
        No chats yet.
      </Typography>
    </Stack>
  );
};
