import {
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { PanelLeftOpen } from "lucide-mui";

import { CONVERSATIONS_SIDEBAR_HEADER_HEIGHT } from "@/components/conversations";
import { theme } from "@/lib/theme";
import { useConversationsSidebarStore } from "@/store/useConversationsSidebarStore";

type ConversationHeaderProps = {
  title?: string;
};

export const ConversationHeader = ({ title }: ConversationHeaderProps) => {
  const isCompact = useMediaQuery(theme.breakpoints.down("lg"));
  const openSidebar = useConversationsSidebarStore(
    (state) => state.openSidebar,
  );

  return (
    <Stack
      sx={{
        minHeight: CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,
        maxHeight: CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,
        px: 2,
        gap: 1,
        flexDirection: "row",
        alignItems: "center",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      {isCompact ? (
        <Tooltip title="Open chats">
          <IconButton
            aria-label="Open chats"
            onClick={openSidebar}
            size="small"
            sx={{
              color: "text.secondary",
              height: 34,
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
      ) : null}
      <Typography fontWeight={800} noWrap variant="h6">
        {title || "Conversation"}
      </Typography>
    </Stack>
  );
};
