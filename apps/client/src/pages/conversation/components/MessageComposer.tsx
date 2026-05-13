import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import type { ConversationMessage } from "@syncr/packages";
import { SendHorizontal, X } from "lucide-mui";
import { useState } from "react";
import { toast } from "sonner";

import { useSendConversationMessage } from "@/api/conversations";
import { getErrorMessage } from "@/utils/getErrorMessage";

type MessageComposerProps = {
  conversationId: number;
  onCancelReply: () => void;
  replyTo: ConversationMessage | null;
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
}: MessageComposerProps) => {
  const [messageText, setMessageText] = useState("");
  const sendMessage = useSendConversationMessage();
  const hasContent = Boolean(messageText.trim());

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
      setMessageText("");
      onCancelReply();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

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
        gap={1}
        sx={{
          maxWidth: 680,
          mx: "auto",
          width: "100%",
        }}
      >
        {replyTo ? (
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
              px: { xs: 1.25, sm: 1.5 },
              py: 1,
            }}
          >
            <Stack minWidth={0} flex={1}>
              <Typography color="primary.main" fontSize={12} fontWeight={800}>
                Replying to {getReplyAuthorName(replyTo)}
              </Typography>
              <Typography color="text.secondary" fontSize={12} noWrap>
                {replyTo.content}
              </Typography>
            </Stack>
            <IconButton
              aria-label="Cancel reply"
              onClick={onCancelReply}
              size="small"
              sx={{ height: 28, width: 28 }}
            >
              <X fontSize="small" />
            </IconButton>
          </Stack>
        ) : null}
        <Stack
          alignItems="center"
          direction="row"
          gap={1}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            boxSizing: "border-box",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            p: 0.75,
            pl: { xs: 1.5, sm: 2 },
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
            onChange={(event) => setMessageText(event.target.value)}
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
              bgcolor: "primary.main",
              color: "primary.contrastText",
              borderRadius: 2,
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
