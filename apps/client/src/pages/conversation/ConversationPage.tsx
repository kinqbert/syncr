import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useParams } from "react-router";

import { useGetConversationHistory } from "@/api/conversations";

const formatMessageTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const ConversationPage = () => {
  const { conversationId } = useParams();
  const parsedConversationId = Number(conversationId);
  const hasValidConversationId =
    Number.isInteger(parsedConversationId) && parsedConversationId > 0;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetConversationHistory(parsedConversationId, 30, hasValidConversationId);

  const messages = data?.pages.flatMap((page) => page.items).reverse() ?? [];

  if (!hasValidConversationId) {
    return (
      <Stack
        width="100%"
        height="100%"
        p={3}
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="text.secondary">Invalid conversation.</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      width="100%"
      height="100%"
      p={3}
      gap={2}
      sx={{ overflow: "hidden" }}
    >
      <Typography variant="h5">Conversation</Typography>

      <Stack gap={1.5} flex={1} minHeight={0} sx={{ overflowY: "auto" }}>
        {hasNextPage ? (
          <Box display="flex" justifyContent="center">
            <Button
              size="small"
              onClick={() => void fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load older messages"}
            </Button>
          </Box>
        ) : null}

        {isLoading ? (
          <Stack flex={1} alignItems="center" justifyContent="center">
            <CircularProgress size={28} />
          </Stack>
        ) : messages.length === 0 ? (
          <Stack flex={1} alignItems="center" justifyContent="center">
            <Typography color="text.secondary">No messages yet.</Typography>
          </Stack>
        ) : (
          messages.map((message) => (
            <Stack
              key={message.id}
              gap={0.5}
              p={1.5}
              borderRadius={1}
              sx={{ bgcolor: "background.paper" }}
            >
              <Stack direction="row" gap={1} alignItems="baseline" flexWrap="wrap">
                <Typography variant="subtitle2">
                  {message.author
                    ? `${message.author.name} ${message.author.surname}`
                    : "Deleted user"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatMessageTime(message.createdAt)}
                </Typography>
              </Stack>
              <Typography sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {message.content}
              </Typography>
            </Stack>
          ))
        )}
      </Stack>
    </Stack>
  );
};
