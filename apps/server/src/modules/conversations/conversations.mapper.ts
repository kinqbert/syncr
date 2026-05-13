import { ConversationType, MessagePayload } from "@syncr/packages";
import { conversations } from "src/db/schema";
import { getFullName } from "src/utils/getFullName";

import { ConversationMessageDto, ListConversationDto } from "./conversations.dto";

export type ListConversationQueryData = {
  conversation: typeof conversations.$inferSelect;
  otherUser: { id: number; name: string; surname: string } | null;
};

type ConversationMessageQueryData = {
  id: number;
  conversationId: number;
  senderId: number | null;
  content: string;
  createdAt: Date;
  editedAt: Date | null;
  user: { id: number; name: string; surname: string } | null;
};

export const mapListConversationToDto = (
  conversationData: ListConversationQueryData,
): ListConversationDto => {
  const { conversation, otherUser } = conversationData;

  const title =
    !conversation.title && conversation.type === ConversationType.Direct && otherUser
      ? getFullName(otherUser.name, otherUser.surname)
      : (conversationData.conversation.title ?? "");

  return {
    id: conversation.id,
    type: conversation.type,
    title,
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
  editedAt: message.editedAt?.toISOString() ?? null,
});

export const mapCreatedMessageToPayload = (message: {
  id: number;
  content: string;
  conversationId: number;
  createdAt: Date;
  sender: {
    id: number;
    name: string;
    surname: string;
  };
}): MessagePayload => {
  return {
    id: message.id,
    content: message.content,
    conversationId: message.conversationId,
    createdAt: message.createdAt.toISOString(),
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      surname: message.sender.surname,
    },
  };
};
