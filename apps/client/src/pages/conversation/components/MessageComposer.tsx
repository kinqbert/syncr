import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import type { ConversationMessage } from "@syncr/packages";
import { SendHorizontal, X } from "lucide-mui";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useSendConversationMessage } from "@/api/conversations";
import { useSocket } from "@/hooks/sockets";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { TypingIndicator, type TypingUser } from "./TypingIndicator";

type MessageComposerProps = {
  conversationId: number;
  onCancelReply: () => void;
  replyTo: ConversationMessage | null;
  typingUsers: TypingUser[];
};

const getReplyAuthorName = (message: ConversationMessage) => {
  return message.author
    ? `${message.author.name} ${message.author.surname}`.trim()
    : "Deleted user";
};

export const MessageComposer = ({
  conversationId,
  onCancelReply,
  replyTo,
  typingUsers,
}: MessageComposerProps) => {
  const [messageText, setMessageText] = useState("");
  const [exitingReply, setExitingReply] =
    useState<ConversationMessage | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);
  const sendMessage = useSendConversationMessage();
  const socket = useSocket();
  const hasContent = Boolean(messageText.trim());
  const displayedReply = replyTo ?? exitingReply;
  const isReplyVisible = Boolean(replyTo);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current != null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const stopTyping = useCallback(() => {
    clearIdleTimer();

    if (!isTypingRef.current) {
      return;
    }

    socket.emit("typing.stopped", { conversationId });
    isTypingRef.current = false;
  }, [clearIdleTimer, conversationId, socket]);

  const registerTypingActivity = useCallback(() => {
    socket.emit("typing.started", { conversationId });

    if (!isTypingRef.current) {
      isTypingRef.current = true;
    }

    clearIdleTimer();
    idleTimerRef.current = window.setTimeout(stopTyping, 3000);
  }, [clearIdleTimer, conversationId, socket, stopTyping]);

  const handleCancelReply = () => {
    if (replyTo) {
      setExitingReply(replyTo);
    }

    onCancelReply();
  };

  const handleSendMessage = async () => {
    const content = messageText.trim();

    if (!content || sendMessage.isPending) {
      return;
    }

    try {
      await sendMessage.mutateAsync({
        body: { content, replyToMessageId: replyTo?.id ?? null },
        conversationId,
      });
      stopTyping();
      setMessageText("");
      handleCancelReply();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, [stopTyping]);

  return (
    <Box
      component="form"
      px={{ xs: 1.5, sm: 2, md: 3 }}
      py={{ xs: 1.25, sm: 1.75 }}
      sx={{
        bgcolor: "background.default",
      }}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSendMessage();
      }}
    >
      <Stack
        sx={{
          maxWidth: 680,
          mx: "auto",
          position: "relative",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: isReplyVisible ? "1fr" : "0fr",
            overflow: "hidden",
            transition: "grid-template-rows 220ms ease",
          }}
          onTransitionEnd={(event) => {
            if (
              event.propertyName === "grid-template-rows" &&
              !replyTo &&
              exitingReply
            ) {
              setExitingReply(null);
            }
          }}
        >
          <Box
            sx={{
              minHeight: 0,
              opacity: isReplyVisible ? 1 : 0,
              pb: isReplyVisible ? 1 : 0,
              transform: isReplyVisible ? "translateY(0)" : "translateY(18px)",
              transition:
                "opacity 180ms ease, transform 220ms ease, padding-bottom 220ms ease",
              zIndex: 0,
            }}
          >
            {displayedReply ? (
              <Stack
                alignItems="center"
                direction="row"
                gap={1}
                sx={{
                  bgcolor: "#EEF2FF",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                  px: { xs: 1.5, sm: 2 },
                  pr: { xs: 1.5, sm: 1.5 },
                  py: 1,
                }}
              >
                <Stack minWidth={0} flex={1}>
                  <Typography
                    color="primary.main"
                    fontSize={12}
                    fontWeight={800}
                  >
                    Replying to {getReplyAuthorName(displayedReply)}
                  </Typography>
                  <Typography color="text.secondary" fontSize={12} noWrap>
                    {displayedReply.content}
                  </Typography>
                </Stack>
                <IconButton
                  aria-label="Cancel reply"
                  onClick={handleCancelReply}
                  size="small"
                  sx={{ height: 28, width: 28 }}
                >
                  <X fontSize="small" />
                </IconButton>
              </Stack>
            ) : null}
          </Box>
        </Box>
        <TypingIndicator users={typingUsers} />
        <Stack
          alignItems="center"
          direction="row"
          gap={1}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 8,
            boxSizing: "border-box",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            p: 0.75,
            pl: { xs: 1.5, sm: 2 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={5}
            minRows={1}
            placeholder="Write a message"
            variant="standard"
            value={messageText}
            onChange={(event) => {
              setMessageText(event.target.value);
              registerTypingActivity();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSendMessage();
              }
            }}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  alignItems: "center",
                  fontSize: 14,
                  lineHeight: "20px",
                  py: 0.75,
                },
              },
            }}
          />
          <IconButton
            color="primary"
            disabled={!hasContent || sendMessage.isPending}
            type="submit"
            sx={{
              alignSelf: "end",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              borderRadius: 6,
              flexShrink: 0,
              height: 40,
              width: 40,
              "&:hover": {
                bgcolor: "primary.dark",
              },
              "&.Mui-disabled": {
                bgcolor: "action.disabledBackground",
              },
            }}
          >
            <SendHorizontal fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};
