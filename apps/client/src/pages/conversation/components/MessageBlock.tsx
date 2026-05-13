import { Stack, Typography } from "@mui/material";

import { UserAvatar } from "@/components/UserAvatar";
import { formatTime24Hour } from "@/utils/formatDate";

import type { MessageBlock as MessageBlockData } from "../utils/conversationMessages";
import { getAuthorName } from "../utils/conversationMessages";
import { MessageBubble } from "./MessageBubble";

type MessageBlockProps = {
  block: MessageBlockData;
};

export const MessageBlock = ({ block }: MessageBlockProps) => {
  return (
    <Stack
      alignItems="flex-end"
      direction={block.isOwn ? "row-reverse" : "row"}
      gap={1}
    >
      {!block.isOwn && (
        <UserAvatar
          name={block.author?.name}
          size={34}
          surname={block.author?.surname}
        />
      )}

      <Stack
        alignItems={block.isOwn ? "flex-end" : "flex-start"}
        gap={0.5}
        maxWidth="min(680px, 76%)"
        minWidth={0}
      >
        {!block.isOwn ? (
          <Stack alignItems="baseline" direction="row" gap={1} minWidth={0}>
            <Typography fontWeight={800} noWrap variant="subtitle2">
              {getAuthorName(block.author)}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {formatTime24Hour(block.messages[0].createdAt)}
            </Typography>
          </Stack>
        ) : null}

        <Stack alignItems={block.isOwn ? "flex-end" : "flex-start"} gap={0.35}>
          {block.messages.map((message, messageIndex) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              isFirstInBlock={messageIndex === 0}
              isOwn={block.isOwn}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
