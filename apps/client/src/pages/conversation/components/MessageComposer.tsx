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
      py={{ xs: 1.25, sm: 1.75 }}
      sx={{
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
      }}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSendMessage();
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        gap={1}
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 999,
          boxSizing: "border-box",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          maxWidth: 680,
          p: 0.75,
          pl: { xs: 1.5, sm: 2 },
          width: "100%",
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
    </Box>
  );
};
