import {
  Avatar,
  Button,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { MessageCircle, PanelLeftOpen } from "lucide-mui";

import { theme } from "@/lib/theme";
import { useConversationsSidebarStore } from "@/store/useConversationsSidebarStore";

export const ConversationEmptyPage = () => {
  const isCompact = useMediaQuery(theme.breakpoints.down("lg"));
  const openSidebar = useConversationsSidebarStore(
    (state) => state.openSidebar,
  );

  return (
    <Stack
      width="100%"
      height="100%"
      p={{ xs: 2, sm: 3 }}
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
      {isCompact ? (
        <Button
          onClick={openSidebar}
          startIcon={<PanelLeftOpen />}
          sx={{ mt: 1 }}
          variant="contained"
        >
          Open chats
        </Button>
      ) : null}
    </Stack>
  );
};
