import { Box } from "@mui/material";
import { Outlet } from "react-router";

import { useGetConversationsList } from "@/api/conversations";
import { theme } from "@/lib/theme";
import { useConversationsSidebarStore } from "@/store/useConversationsSidebarStore";

import {
  CONVERSATIONS_SIDEBAR_COLLAPSED_WIDTH,
  CONVERSATIONS_SIDEBAR_WIDTH,
} from "./constants";
import { ConversationsSidebar } from "./ConversationsSidebar";

export const ConversationsLayout = () => {
  const { data: conversations = [], isLoading } = useGetConversationsList();
  const open = useConversationsSidebarStore((state) => state.isOpen);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `${
          open
            ? CONVERSATIONS_SIDEBAR_WIDTH
            : CONVERSATIONS_SIDEBAR_COLLAPSED_WIDTH
        }px 1fr`,
        height: "100%",
        transition: theme.transitions.create("grid-template-columns", {
          duration: theme.transitions.duration.enteringScreen,
          easing: theme.transitions.easing.sharp,
        }),
      }}
    >
      <ConversationsSidebar conversations={conversations} loading={isLoading} />

      <Outlet />
    </Box>
  );
};
