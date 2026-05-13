import { Stack, Typography } from "@mui/material";

import { CONVERSATIONS_SIDEBAR_HEADER_HEIGHT } from "@/components/ConversationsSidebar";

type ConversationHeaderProps = {
  title?: string;
};

export const ConversationHeader = ({ title }: ConversationHeaderProps) => {
  return (
    <Stack
      sx={{
        minHeight: CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,
        maxHeight: CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,
        px: 2,
        gap: 0.5,
        flexDirection: "row",
        alignItems: "center",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Typography fontWeight={800} variant="h6">
        {title || "Conversation"}
      </Typography>
    </Stack>
  );
};
