import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { PanelLeftClose, PanelLeftOpen, SquarePen } from "lucide-mui";

import { CONVERSATIONS_SIDEBAR_HEADER_HEIGHT } from "./constants";

type ConversationsSidebarHeaderProps = {
  open: boolean;
  unreadCount: number;
  onCreate: () => void;
  toggleSidebar?: () => void;
};

export const ConversationsSidebarHeader = ({
  onCreate,
  open,
  toggleSidebar,
  unreadCount,
}: ConversationsSidebarHeaderProps) => (
  <Stack
    alignItems="center"
    direction={open ? "row" : "column"}
    gap={0.5}
    justifyContent="space-between"
    sx={{
      borderBottom: 1,
      borderColor: "divider",
      flexShrink: 0,
      minHeight: CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,
      px: open ? 2 : 1,
      py: open ? 0 : 1,
    }}
  >
    {open && (
      <Stack alignItems="baseline" direction="row" gap={1} minWidth={0}>
        <Typography component="h1" noWrap variant="h6">
          Conversations
        </Typography>
        {unreadCount > 0 && (
          <Typography color="text.secondary" variant="body2">
            {unreadCount > 99 ? "99+" : unreadCount} unread
          </Typography>
        )}
      </Stack>
    )}

    <Stack direction={open ? "row" : "column"} gap={0.25}>
      <Tooltip placement={open ? "bottom" : "right"} title="New chat">
        <IconButton aria-label="New chat" onClick={onCreate} size="small">
          <SquarePen />
        </IconButton>
      </Tooltip>
      {toggleSidebar && (
        <Tooltip
          placement={open ? "bottom" : "right"}
          title={open ? "Collapse chats" : "Expand chats"}
        >
          <IconButton
            aria-label={open ? "Collapse chats" : "Expand chats"}
            onClick={toggleSidebar}
            size="small"
          >
            {open ? <PanelLeftClose /> : <PanelLeftOpen />}
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  </Stack>
);
