import { Box } from "@mui/material";
import { Outlet } from "react-router";

import { useGetConversationsList } from "@/api/conversations";

import { ConversationsSidebar } from "./ConversationsSidebar";

export const ConversationsLayout = () => {
  const { data: conversations = [], isLoading } = useGetConversationsList();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        height: "100%",
      }}
    >
      <ConversationsSidebar conversations={conversations} loading={isLoading} />

      <Outlet />
    </Box>
  );
};
