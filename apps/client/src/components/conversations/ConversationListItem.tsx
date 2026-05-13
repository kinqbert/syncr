import {
  Badge,
  Chip,
  ListItem,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ListConversation } from "@syncr/packages";
import { ConversationType } from "@syncr/packages";
import { NavLink } from "react-router";

import { ConversationAvatar } from "./ConversationAvatar";

type ConversationListItemProps = {
  conversation: ListConversation;
  onClick?: () => void;
  open: boolean;
};

const SIZE = 48;

export const ConversationListItem = ({
  conversation,
  onClick,
  open,
}: ConversationListItemProps) => {
  const typeLabel =
    conversation.type === ConversationType.Direct
      ? "Direct chat"
      : "Group chat";

  return (
    <Tooltip
      title={open ? "" : conversation.title || "Untitled chat"}
      placement="right"
    >
      <ListItem
        component={NavLink}
        onClick={onClick}
        to={`/conversations/${conversation.id}`}
        sx={{
          minHeight: SIZE,
          maxHeight: SIZE,

          minWidth: SIZE,

          mb: 0.5,
          overflowX: "hidden",
          p: 0,
          "&.active": {
            color: "primary.main",
          },
          "&.active .MuiListItemButton-root": {
            bgcolor: "action.selected",
          },
          "&.active .MuiAvatar-root": {
            boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.22)",
          },
        }}
      >
        <ListItemButton
          sx={{
            borderRadius: 1.5,
            gap: open ? 1.15 : 0,
            justifyContent: "initial",
            minHeight: 48,
            px: 1,
            py: 0.5,
            transition:
              "background-color 160ms ease, color 160ms ease, gap 220ms ease",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Badge
            color="primary"
            badgeContent={conversation.unreadCount}
            invisible={conversation.unreadCount === 0}
            overlap="circular"
          >
            <ConversationAvatar
              title={conversation.title}
              type={conversation.type}
              size={32}
            />
          </Badge>
          <Stack
            gap={0.25}
            justifyContent="center"
            minWidth={0}
            sx={{
              flex: open ? "1 1 auto" : "0 1 auto",
              maxWidth: open ? 220 : 0,
              opacity: open ? 1 : 0,
              overflow: "hidden",
              transition:
                "max-width 220ms ease, opacity 180ms ease, flex-basis 220ms ease",
            }}
            width="100%"
          >
            <Typography fontSize={14} fontWeight={800} lineHeight="18px" noWrap>
              {conversation.title || "Untitled chat"}
            </Typography>
            <Stack alignItems="center" direction="row" gap={0.75} minWidth={0}>
              <Typography
                color="text.secondary"
                fontSize={12}
                lineHeight="16px"
                noWrap
              >
                {typeLabel}
              </Typography>
              {conversation.unreadCount > 0 ? (
                <Chip
                  color="primary"
                  label={
                    conversation.unreadCount > 99
                      ? "99+ unread"
                      : `${conversation.unreadCount} unread`
                  }
                  size="small"
                  sx={{
                    height: 18,
                    "& .MuiChip-label": {
                      fontSize: 11,
                      fontWeight: 800,
                      px: 0.75,
                    },
                  }}
                />
              ) : null}
            </Stack>
          </Stack>
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};
