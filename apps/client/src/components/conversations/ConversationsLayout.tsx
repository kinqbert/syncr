import { Box, Drawer, useMediaQuery } from "@mui/material";
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
  const closeSidebar = useConversationsSidebarStore(
    (state) => state.closeSidebar,
  );
  const isCompact = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isCompact
          ? "minmax(0, 1fr)"
          : `${
              open
                ? CONVERSATIONS_SIDEBAR_WIDTH
                : CONVERSATIONS_SIDEBAR_COLLAPSED_WIDTH
            }px minmax(0, 1fr)`,
        height: "100%",
        transition: theme.transitions.create("grid-template-columns", {
          duration: theme.transitions.duration.enteringScreen,
          easing: theme.transitions.easing.sharp,
        }),
      }}
    >
      {isCompact ? (
        <Drawer
          open={open}
          onClose={closeSidebar}
          sx={{
            "& .MuiDrawer-paper": {
              height: "100dvh",
              maxWidth: CONVERSATIONS_SIDEBAR_WIDTH,
              width: "min(86vw, 300px)",
            },
          }}
          variant="temporary"
        >
          <ConversationsSidebar
            conversations={conversations}
            forceOpen
            loading={isLoading}
            onConversationSelect={closeSidebar}
          />
        </Drawer>
      ) : (
        <ConversationsSidebar
          conversations={conversations}
          loading={isLoading}
        />
      )}

      <Outlet />
    </Box>
  );
};
