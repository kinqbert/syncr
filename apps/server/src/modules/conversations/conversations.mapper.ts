import { ConversationType } from "@syncr/packages";
import { conversations, messages } from "src/db/schema";
import { getFullName } from "src/utils/getFullName";

import { ConversationMessageDto, ListConversationDto } from "./conversations.dto";

export type ListConversationQueryData = {
  conversation: typeof conversations.$inferSelect;
  lastMessage: typeof messages.$inferSelect | null;
  otherUser: { id: number; name: string; surname: string } | null;
  lastMessageSender: { id: number; name: string; surname: string } | null;
};

type ConversationMessageQueryData = {
  id: number;
  conversationId: number;
  senderId: number | null;
  content: string;
  createdAt: Date;
  editedAt: Date;
  user: { id: number; name: string; surname: string } | null;
};

export const mapListConversationToDto = (
  conversationData: ListConversationQueryData,
): ListConversationDto => {
  const { conversation, lastMessage, otherUser, lastMessageSender } = conversationData;

  const title =
    !conversation.title && conversation.type === ConversationType.Direct && otherUser
      ? getFullName(otherUser.name, otherUser.surname)
      : (conversationData.conversation.title ?? "");

  return {
    id: conversation.id,
    type: conversation.type,
    title,

    ...(lastMessage
      ? {
          lastMessage: {
            authorName:
              lastMessageSender?.name && lastMessageSender?.surname
                ? getFullName(lastMessageSender?.name, lastMessageSender?.surname)
                : "",
            content: lastMessage.content,
          },
        }
      : {}),
  };
};

export const mapConversationMessageToDto = (
  message: ConversationMessageQueryData,
): ConversationMessageDto => ({
  id: message.id,
  conversationId: message.conversationId,
  author: message.user
    ? {
        id: message.user.id,
        name: message.user.name,
        surname: message.user.surname,
      }
    : null,
  content: message.content,
  createdAt: message.createdAt.toISOString(),
  editedAt: message.editedAt.toISOString(),
});
