import { Badge, Box, Stack, Tooltip, Typography } from "@mui/material";
import type { ListConversation } from "@syncr/packages";
import { ConversationType } from "@syncr/packages";
import { NavLink } from "react-router";

import { ConversationAvatar } from "./ConversationAvatar";

type ConversationListItemProps = {
  conversation: ListConversation;
  onClick?: () => void;
  open: boolean;
};

export const ConversationListItem = ({
  conversation,
  onClick,
  open,
}: ConversationListItemProps) => {
  const title = conversation.title || "Untitled chat";
  const hasUnread = conversation.unreadCount > 0;

  return (
    <Tooltip placement="right" title={open ? "" : title}>
      <Box
        aria-label={open ? undefined : title}
        component={NavLink}
        onClick={onClick}
        to={`/conversations/${conversation.id}`}
        sx={{
          alignItems: "center",
          borderRadius: 1,
          color: "text.primary",
          display: "flex",
          gap: 1.25,
          justifyContent: open ? "flex-start" : "center",
          minHeight: 44,
          px: open ? 1 : 0,
          transition: "background-color 120ms ease",
          "&:hover": { bgcolor: "surface.hover" },
          "&.active": { bgcolor: "surface.active" },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: -2,
          },
        }}
      >
        <Badge
          color="primary"
          invisible={open || !hasUnread}
          overlap="circular"
          variant="dot"
        >
          <ConversationAvatar
            size={28}
            title={conversation.title}
            type={conversation.type}
          />
        </Badge>
        {open && (
          <>
            <Stack flex={1} minWidth={0}>
              <Typography fontWeight={hasUnread ? 600 : 500} noWrap>
                {title}
              </Typography>
              <Typography color="text.secondary" noWrap variant="body2">
                {conversation.type === ConversationType.Direct
                  ? "Direct message"
                  : "Group"}
              </Typography>
            </Stack>
            {hasUnread && (
              <Box
                component="span"
                sx={{
                  bgcolor: "primary.main",
                  borderRadius: 999,
                  color: "primary.contrastText",
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: "18px",
                  minWidth: 18,
                  px: 0.625,
                  textAlign: "center",
                }}
              >
                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
              </Box>
            )}
          </>
        )}
      </Box>
    </Tooltip>
  );
};
