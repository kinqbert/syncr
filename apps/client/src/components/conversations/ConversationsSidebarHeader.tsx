import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { PanelLeftClose, PanelLeftOpen } from "lucide-mui";

import { CONVERSATIONS_SIDEBAR_HEADER_HEIGHT } from "./constants";

type ConversationsSidebarHeaderProps = {
  onClose: () => void;
  onOpen: () => void;
  open: boolean;
  unreadCount: number;
};

export const ConversationsSidebarHeader = ({
  onClose,
  onOpen,
  open,
  unreadCount,
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
      {open ? (
        <>
          <Stack direction="row" alignItems="center" gap={1} minWidth={0}>
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
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Typography>
            )}
          </Stack>

          <Tooltip title="Collapse chats">
            <IconButton
              aria-label="Collapse chats"
              onClick={onClose}
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
              <PanelLeftClose fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Expand chats">
          <IconButton
            aria-label="Expand chats"
            onClick={onOpen}
            size="small"
            sx={{
              color: "text.secondary",
              height: 34,
              mx: "auto",
              width: 34,
              "&:hover": {
                bgcolor: "action.hover",
                color: "text.primary",
              },
            }}
          >
            <PanelLeftOpen fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};
