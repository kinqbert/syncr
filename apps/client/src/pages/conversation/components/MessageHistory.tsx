import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef } from "react";

import { useGetConversationHistory } from "@/api/conversations";

import { buildMessageBlocks } from "../utils/conversationMessages";
import { MessageBlock } from "./MessageBlock";

type MessageHistoryProps = {
  conversationId: number;
  currentUserId?: number;
  enabled: boolean;
};

export const MessageHistory = ({
  conversationId,
  currentUserId,
  enabled,
}: MessageHistoryProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const {
    data: conversationHistory,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetConversationHistory(conversationId, 30, enabled);

  const messages = useMemo(
    () =>
      conversationHistory?.pages.flatMap((page) => page.items).reverse() ?? [],
    [conversationHistory],
  );
  const messageBlocks = useMemo(
    () => buildMessageBlocks(messages, currentUserId),
    [currentUserId, messages],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [conversationId, messages.length]);

  return (
    <Stack
      width="100%"
      maxWidth={1000}
      flex={1}
      minHeight={0}
      alignSelf="center"
      px={3}
      py={2}
      sx={{
        overflowY: "auto",
        scrollbarColor: "#c0c0c0 transparent",
        scrollbarWidth: "thin",
      }}
    >
      {hasNextPage ? (
        <Box display="flex" justifyContent="center" pb={2}>
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
        <Stack flex={1} alignItems="center" justifyContent="center" gap={1}>
          <Typography fontWeight={800}>Start the conversation</Typography>
          <Typography color="text.secondary" variant="body2">
            Send the first message below.
          </Typography>
        </Stack>
      ) : (
        <Stack gap={2.5}>
          {messageBlocks.map((block, index) => {
            const previousBlock = messageBlocks[index - 1];
            const showDate =
              !previousBlock || previousBlock.date !== block.date;

            return (
              <Stack key={block.id} gap={1.25}>
                {showDate ? (
                  <Stack alignItems="center" direction="row" gap={1.5}>
                    <Divider sx={{ flex: 1 }} />
                    <Typography
                      color="text.secondary"
                      fontWeight={700}
                      variant="caption"
                    >
                      {block.date}
                    </Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Stack>
                ) : null}

                <MessageBlock block={block} />
              </Stack>
            );
          })}
          <Box ref={bottomRef} />
        </Stack>
      )}
    </Stack>
  );
};
