import { Box, CircularProgress, ListItem, Stack } from "@mui/material";
import type { ListConversation } from "@syncr/packages";

type ConversationsSidebarProps = {
  conversations: ListConversation[];
  loading?: boolean;
};

export const ConversationsSidebar = ({
  conversations,
  loading = false,
}: ConversationsSidebarProps) => {
  if (loading) {
    return (
      <Stack
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack width="100%" gap={1} sx={{ borderRight: 1, borderColor: "divider" }}>
      {conversations.map((conversation) => (
        <ListItem key={conversation.id}>
          <Box width="100%">{conversation.title}</Box>
        </ListItem>
      ))}
    </Stack>
  );
};
