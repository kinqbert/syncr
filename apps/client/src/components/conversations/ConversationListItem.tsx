import {
  ListItem,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ListConversation } from "@syncr/packages";
import { NavLink } from "react-router";

import { ConversationAvatar } from "./ConversationAvatar";

type ConversationListItemProps = {
  conversation: ListConversation;
  open: boolean;
};

export const ConversationListItem = ({
  conversation,
  open,
}: ConversationListItemProps) => {
  return (
    <Tooltip
      title={open ? "" : conversation.title || "Untitled chat"}
      placement="right"
    >
      <ListItem
        component={NavLink}
        to={`/conversations/${conversation.id}`}
        sx={{
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
            gap: open ? 1 : 0,
            justifyContent: "initial",
            minHeight: 44,
            px: 1,
            py: 0.5,
            transition:
              "background-color 160ms ease, color 160ms ease, gap 220ms ease",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <ConversationAvatar
            title={conversation.title}
            type={conversation.type}
            size={30}
          />
          <Stack
            alignItems="center"
            direction="row"
            gap={1}
            justifyContent="space-between"
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
            <Typography fontSize={14} fontWeight={800} noWrap>
              {conversation.title || "Untitled chat"}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ textTransform: "capitalize" }}
              variant="caption"
            >
              {conversation.type}
            </Typography>
          </Stack>
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};
