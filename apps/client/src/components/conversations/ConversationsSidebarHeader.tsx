import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { PanelLeftClose, PanelLeftOpen } from "lucide-mui";

import { CONVERSATIONS_SIDEBAR_HEADER_HEIGHT } from "./constants";

type ConversationsSidebarHeaderProps = {
  open: boolean;
  unreadCount: number;
  toggleSidebar: () => void;
  toggleSidebar: () => void;
};

export const ConversationsSidebarHeader = ({
  open,
  unreadCount,
  toggleSidebar,
  toggleSidebar,
}: ConversationsSidebarHeaderProps) => {
  return (
    <Stack
      sx={{
        minHeight: CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,
        maxHeight: CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,
        px: 2,
        borderBottom: 1,
        borderColor: "divider",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap={open ? 1 : 0}
        minWidth={0}
        sx={{
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition:
            "max-width 220ms ease, opacity 160ms ease, gap 220ms ease",
        }}
      >
        <Typography fontWeight={800} noWrap variant="h6">
          Chats
        </Typography>
        {unreadCount > 0 && (
          <Typography
            bgcolor="primary.main"
            borderRadius={999}
            color="primary.contrastText"
            fontSize={12}
            fontWeight={800}
            minWidth={22}
            px={0.75}
            textAlign="center"
            sx={{
              overflow: "hidden",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Typography>
        )}
      </Stack>

      <Tooltip title="Collapse chats">
        <IconButton
          aria-label="Collapse chats"
          onClick={toggleSidebar}
          size="small"
          sx={{
            justifySelf: "end",
            color: "text.secondary",
            height: 34,
            ml: "auto",
            width: 34,
            "&:hover": {
              bgcolor: "action.hover",
              color: "text.primary",
            },
          }}
        >
          {open ? (
            <PanelLeftClose fontSize="small" />
          ) : (
            <PanelLeftOpen fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
