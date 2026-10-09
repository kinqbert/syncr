import { Button, Stack, useMediaQuery } from "@mui/material";
import { MessageCircle, PanelLeftOpen } from "lucide-mui";

import { EmptyState } from "@/components/ui";
import { theme } from "@/lib/theme";
import { useConversationsSidebarStore } from "@/store/useConversationsSidebarStore";

export const ConversationEmptyPage = () => {
  const isCompact = useMediaQuery(theme.breakpoints.down("lg"));
  const openSidebar = useConversationsSidebarStore(
    (state) => state.openSidebar,
  );

  return (
    <Stack
      alignItems="center"
      height="100%"
      justifyContent="center"
      width="100%"
    >
      <EmptyState
        action={
          isCompact ? (
            <Button
              onClick={openSidebar}
              startIcon={<PanelLeftOpen />}
              variant="outlined"
            >
              Open chats
            </Button>
          ) : undefined
        }
        description="Pick a conversation from the list or start a new one."
        icon={<MessageCircle />}
        title="No conversation selected"
      />
    </Stack>
  );
};
