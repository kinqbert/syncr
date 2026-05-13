import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import type { ConversationMessage } from "@syncr/packages";
import { ArrowDown } from "lucide-mui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useGetConversationHistory } from "@/api/conversations";

import { buildMessageBlocks } from "../utils/conversationMessages";
import { MessageBlock } from "./MessageBlock";

type MessageHistoryProps = {
  conversationId: number;
  currentUserId?: number;
  enabled: boolean;
  onReply: (message: ConversationMessage) => void;
};

export const MessageHistory = ({
  conversationId,
  currentUserId,
  enabled,
  onReply,
}: MessageHistoryProps) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [highlightedMessage, setHighlightedMessage] = useState<{
    conversationId: number;
    messageId: number;
  } | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const highlightClearTimerRef = useRef<number | null>(null);
  const messageRefs = useRef(new Map<number, HTMLDivElement>());
  const pendingScrollMessageIdRef = useRef<number | null>(null);
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
  const highlightedMessageId =
    highlightedMessage?.conversationId === conversationId
      ? highlightedMessage.messageId
      : null;

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

  const scroll = useCallback(({ smooth = false }: { smooth?: boolean } = {}) => {
    bottomRef.current?.scrollIntoView({
      block: "end",
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const handleScrollToBottom = useCallback(() => {
    setIsAtBottom(true);
    isAtBottomRef.current = true;
    scroll();
  }, [scroll]);

  const registerMessageRef = useCallback(
    (messageId: number, element: HTMLDivElement | null) => {
      if (element) {
        messageRefs.current.set(messageId, element);
      } else {
        messageRefs.current.delete(messageId);
      }
    },
    [],
  );

  const scheduleHighlightClear = useCallback(() => {
    if (highlightClearTimerRef.current != null) {
      window.clearTimeout(highlightClearTimerRef.current);
    }

    highlightClearTimerRef.current = window.setTimeout(() => {
      setHighlightedMessage(null);
      highlightClearTimerRef.current = null;
    }, 1800);
  }, []);

  const scrollToMessage = useCallback((messageId: number) => {
    const element = messageRefs.current.get(messageId);

    if (!element) {
      return false;
    }

    element.scrollIntoView({ behavior: "smooth", block: "center" });

    return true;
  }, []);

  const handleReplyClick = useCallback(
    (messageId: number) => {
      if (highlightClearTimerRef.current != null) {
        window.clearTimeout(highlightClearTimerRef.current);
        highlightClearTimerRef.current = null;
      }

      setHighlightedMessage({ conversationId, messageId });

      if (scrollToMessage(messageId)) {
        pendingScrollMessageIdRef.current = null;
        scheduleHighlightClear();
        return;
      }

      pendingScrollMessageIdRef.current = messageId;

      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    [
      conversationId,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      scheduleHighlightClear,
      scrollToMessage,
    ],
  );

  useEffect(() => {
    scroll();
    isAtBottomRef.current = true;
    pendingScrollMessageIdRef.current = null;
  }, [conversationId, scroll]);

  useEffect(() => {
    return () => {
      if (highlightClearTimerRef.current != null) {
        window.clearTimeout(highlightClearTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) {
      scroll({ smooth: true });
    }
  }, [messages.length, scroll]);

  useEffect(() => {
    const pendingScrollMessageId = pendingScrollMessageIdRef.current;

    if (pendingScrollMessageId == null) {
      return;
    }

    if (scrollToMessage(pendingScrollMessageId)) {
      pendingScrollMessageIdRef.current = null;
      scheduleHighlightClear();
      return;
    }

    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
      return;
    }

    if (!hasNextPage && !isFetchingNextPage) {
      pendingScrollMessageIdRef.current = null;
      scheduleHighlightClear();
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    messages.length,
    scheduleHighlightClear,
    scrollToMessage,
  ]);

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
        maxWidth={680}
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

                  <MessageBlock
                    block={block}
                    highlightedMessageId={highlightedMessageId}
                    onMessageRef={registerMessageRef}
                    onReply={onReply}
                    onReplyClick={handleReplyClick}
                  />
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
