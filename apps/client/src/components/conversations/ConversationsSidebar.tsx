import { Alert, Button, Stack } from "@mui/material";
import type { ListConversation } from "@syncr/packages";
import { useState } from "react";

import { EmptyState, RowSkeleton } from "@/components/ui";
import { theme } from "@/lib/theme";
import { useConversationsSidebarStore } from "@/store/useConversationsSidebarStore";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { ConversationListItem } from "./ConversationListItem";
import { ConversationsSidebarHeader } from "./ConversationsSidebarHeader";
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
  const toggleSidebar = useConversationsSidebarStore(
    (state) => state.toggleSidebar,
  );

  const unreadCount = conversations.reduce(
    (sum, conversation) => sum + conversation.unreadCount,
    0,
  );

  return (
    <>
      <Stack
        height="100%"
        width="100%"
        sx={{
          bgcolor: "background.default",
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
          onCreate={() => setDialogOpen(true)}
          open={visibleOpen}
          toggleSidebar={forceOpen ? undefined : toggleSidebar}
          unreadCount={unreadCount}
        />

        <Stack
          flex={1}
          minHeight={0}
          gap={0.25}
          p={1}
          sx={{ overflowY: "auto" }}
        >
          {loading ? <RowSkeleton count={4} /> : null}

          {!loading && !hasError && conversations.length === 0 && visibleOpen ? (
            <EmptyState
              action={
                <Button
                  onClick={() => setDialogOpen(true)}
                  size="small"
                  variant="outlined"
                >
                  New chat
                </Button>
              }
              compact
              title="No conversations yet"
            />
          ) : null}

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
