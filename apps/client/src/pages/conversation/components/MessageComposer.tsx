import { Box, IconButton, Stack, TextField } from "@mui/material";
import { SendHorizontal } from "lucide-mui";
import { useState } from "react";
import { toast } from "sonner";

import { useSendConversationMessage } from "@/api/conversations";
import { getErrorMessage } from "@/utils/getErrorMessage";

type MessageComposerProps = {
  conversationId: number;
};

export const MessageComposer = ({ conversationId }: MessageComposerProps) => {
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
        body: { content },
        conversationId,
      });
      setMessageText("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Box
      component="form"
      px={{ xs: 1.5, sm: 2, md: 3 }}
      py={{ xs: 1.25, sm: 2 }}
      sx={{
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSendMessage();
      }}
    >
      <Stack alignItems="flex-end" direction="row" gap={1.25}>
        <TextField
          fullWidth
          multiline
          maxRows={5}
          minRows={1}
          placeholder="Write a message"
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleSendMessage();
            }
          }}
        />
        <IconButton
          color="primary"
          disabled={!hasContent || sendMessage.isPending}
          type="submit"
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            flexShrink: 0,
            height: 42,
            width: 42,
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
    </Box>
  );
};
