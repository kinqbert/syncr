import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowDown } from "lucide-mui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [isAtBottom, setIsAtBottom] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(true);
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

  const updateIsAtBottom = useCallback(() => {
    const element = scrollContainerRef.current;

    if (!element) {
      return;
    }

    const nextIsAtBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight <= 24;

    isAtBottomRef.current = nextIsAtBottom;
    setIsAtBottom(nextIsAtBottom);
  }, []);

  const scroll = ({ smooth = false }: { smooth?: boolean } = {}) => {
    bottomRef.current?.scrollIntoView({
      block: "end",
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const handleScrollToBottom = useCallback(() => {
    setIsAtBottom(true);
    isAtBottomRef.current = true;
    scroll();
  }, []);

  useEffect(() => {
    scroll();
    isAtBottomRef.current = true;
  }, [conversationId]);

  useEffect(() => {
    if (isAtBottomRef.current) {
      scroll({ smooth: true });
    }
  }, [messages.length]);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        position: "relative",
      }}
    >
      <Stack
        ref={scrollContainerRef}
        width="100%"
        maxWidth={1000}
        height="100%"
        minHeight={0}
        alignSelf="center"
        mx="auto"
        px={{ xs: 1.5, sm: 2, md: 3 }}
        py={{ xs: 1.5, sm: 2 }}
        onScroll={updateIsAtBottom}
        sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
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
          <Stack gap={{ xs: 2, sm: 2.5 }}>
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

      <IconButton
        aria-label="Scroll to latest message"
        onClick={handleScrollToBottom}
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          bottom: 16,
          boxShadow: "0 8px 24px rgba(17, 24, 39, 0.16)",
          color: "primary.main",
          height: 40,
          left: "50%",
          position: "absolute",
          transform: "translateX(-50%)",
          width: 40,
          opacity: isAtBottom ? 0 : 1,
          transition: "opacity 0.1s",
          "&:hover": {
            bgcolor: "#EEF2FF",
          },
        }}
      >
        <ArrowDown fontSize="small" />
      </IconButton>
    </Box>
  );
};
