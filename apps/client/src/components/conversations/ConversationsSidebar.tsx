import { Alert, CircularProgress, Stack } from "@mui/material";
import type { ListConversation } from "@syncr/packages";
import { useState } from "react";

import { theme } from "@/lib/theme";
import { useConversationsSidebarStore } from "@/store/useConversationsSidebarStore";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { ConversationListItem } from "./ConversationListItem";
import { ConversationsSidebarHeader } from "./ConversationsSidebarHeader";
import { CreateConversationListItem } from "./CreateConversationListItem";
import { NewConversationDialog } from "./NewConversationDialog";

type ConversationsSidebarProps = {
  conversations: ListConversation[];
  error?: unknown;
  forceOpen?: boolean;
  hasError?: boolean;
  loading?: boolean;
  onConversationSelect?: () => void;
};

export const ConversationsSidebar = ({
  conversations,
  error,
  forceOpen = false,
  hasError = false,
  loading = false,
  onConversationSelect,
}: ConversationsSidebarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = useConversationsSidebarStore((state) => state.isOpen);
  const visibleOpen = forceOpen || open;
  const openSidebar = useConversationsSidebarStore(
    (state) => state.openSidebar,
  );
  const closeSidebar = useConversationsSidebarStore(
    (state) => state.closeSidebar,
  );

  const unreadCount = conversations.reduce(
    (sum, conversation) => sum + conversation.unreadCount,
    0,
  );

  if (loading) {
    return (
      <Stack
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      <Stack
        height="100%"
        width="100%"
        sx={{
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          overflow: "hidden",
          transition: theme.transitions.create("width", {
            duration: theme.transitions.duration.enteringScreen,
            easing: theme.transitions.easing.sharp,
          }),
        }}
      >
        <ConversationsSidebarHeader
          open={visibleOpen}
          unreadCount={unreadCount}
          onClose={closeSidebar}
          onOpen={openSidebar}
        />

        <Stack
          flex={1}
          minHeight={0}
          p={1}
          sx={{
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <CreateConversationListItem
            open={visibleOpen}
            onClick={() => setDialogOpen(true)}
          />

          {hasError ? (
            <Alert severity="error" sx={{ m: visibleOpen ? 1 : 0 }}>
              {getErrorMessage(error, "Could not load conversations.")}
            </Alert>
          ) : null}

          {conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              onClick={onConversationSelect}
              open={visibleOpen}
            />
          ))}
        </Stack>
      </Stack>

      <NewConversationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};
