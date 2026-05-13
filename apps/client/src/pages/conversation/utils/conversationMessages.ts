import type {
  ConversationMessage,
  ConversationMessageAuthor,
  MessagePayload,
} from "@syncr/packages";

import { formatDateMedium } from "@/utils/formatDate";
import { getUserFullName } from "@/utils/getUserFullName";

export type MessageBlock = {
  author: ConversationMessageAuthor | null;
  date: string;
  id: string;
  isOwn: boolean;
  messages: ConversationMessage[];
};

export const getAuthorName = (author: ConversationMessageAuthor | null) =>
  author ? getUserFullName(author.name, author.surname) : "Deleted user";

export const mapMessagePayloadToConversationMessage = (
  payload: MessagePayload,
): ConversationMessage => ({
  id: payload.id,
  conversationId: payload.conversationId,
  author: {
    id: payload.sender.id,
    name: payload.sender.name,
    surname: payload.sender.surname,
  },
  content: payload.content,
  createdAt: payload.createdAt,
  editedAt: null,
  replyTo: payload.replyTo,
});

export const buildMessageBlocks = (
  messages: ConversationMessage[],
  currentUserId?: number,
) => {
  const blocks: MessageBlock[] = [];

  messages.forEach((message) => {
    const authorKey = message.author?.id ?? "deleted";
    const date = formatDateMedium(message.createdAt);
    const previous = blocks.at(-1);
    const isOwn = Boolean(
      currentUserId && message.author?.id === currentUserId,
    );

    if (
      previous &&
      previous.date === date &&
      previous.isOwn === isOwn &&
      (previous.author?.id ?? "deleted") === authorKey
    ) {
      previous.messages.push(message);
      return;
    }

    blocks.push({
      author: message.author,
      date,
      id: `${date}-${authorKey}-${message.id}`,
      isOwn,
      messages: [message],
    });
  });

  return blocks;
};
