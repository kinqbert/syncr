import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { ListConversation } from "@syncr/packages";
import { ConversationType } from "@syncr/packages";
import { PanelLeftOpen } from "lucide-mui";

import {
  CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,
} from "@/components/conversations";
import { ConversationAvatar } from "@/components/conversations/ConversationAvatar";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useConversationsSidebarStore } from "@/store/useConversationsSidebarStore";

type ConversationHeaderProps = {
  conversation?: ListConversation;
};

export const ConversationHeader = ({ conversation }: ConversationHeaderProps) => {
  const isMobile = useIsMobile();
  const openSidebar = useConversationsSidebarStore(
    (state) => state.openSidebar,
  );
  const title = conversation?.title || "Conversation";

  return (
    <Stack
      alignItems="center"
      direction="row"
      gap={1.25}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        flexShrink: 0,
        minHeight: CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,
        px: 2,
      }}
    >
      {isMobile ? (
        <Tooltip title="Open chats">
          <IconButton aria-label="Open chats" onClick={openSidebar} size="small">
            <PanelLeftOpen />
          </IconButton>
        </Tooltip>
      ) : null}
      {conversation && (
        <ConversationAvatar
          size={28}
          title={conversation.title}
          type={conversation.type}
        />
      )}
      <Stack minWidth={0}>
        <Typography component="h1" fontWeight={600} noWrap>
          {title}
        </Typography>
        {conversation && (
          <Typography color="text.secondary" noWrap variant="body2">
            {conversation.type === ConversationType.Direct
              ? "Direct message"
              : "Group conversation"}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
