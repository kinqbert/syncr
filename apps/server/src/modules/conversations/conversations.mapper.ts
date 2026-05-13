import { ConversationType, MessagePayload } from "@syncr/packages";
import { conversations } from "src/db/schema";
import { getFullName } from "src/utils/getFullName";

import { ConversationMessageDto, ListConversationDto } from "./conversations.dto";

export type ListConversationQueryData = {
  conversation: typeof conversations.$inferSelect;
  otherUser: { id: number; name: string; surname: string } | null;
  unreadCount: number;
};

type ConversationMessageQueryData = {
  id: number;
  conversationId: number;
  senderId: number | null;
  content: string;
  createdAt: Date;
  editedAt: Date | null;
  user: { id: number; name: string; surname: string } | null;
  replyToId: number | null;
  replyToContent: string | null;
  replyToCreatedAt: Date | null;
  replyToAuthorId: number | null;
  replyToAuthorName: string | null;
  replyToAuthorSurname: string | null;
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
    unreadCount: conversationData.unreadCount,
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
  replyTo:
    message.replyToId != null &&
    message.replyToContent != null &&
    message.replyToCreatedAt != null
      ? {
          id: message.replyToId,
          author:
            message.replyToAuthorId != null &&
            message.replyToAuthorName != null &&
            message.replyToAuthorSurname != null
              ? {
                  id: message.replyToAuthorId,
                  name: message.replyToAuthorName,
                  surname: message.replyToAuthorSurname,
                }
              : null,
          content: message.replyToContent,
          createdAt: message.replyToCreatedAt.toISOString(),
        }
      : null,
  createdAt: message.createdAt.toISOString(),
  editedAt: message.editedAt?.toISOString() ?? null,
});

export const mapCreatedMessageToPayload = (message: {
  id: number;
  content: string;
  conversationId: number;
  createdAt: Date;
  replyToId: number | null;
  replyToContent: string | null;
  replyToCreatedAt: Date | null;
  replyToAuthorId: number | null;
  replyToAuthorName: string | null;
  replyToAuthorSurname: string | null;
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
    replyTo:
      message.replyToId != null &&
      message.replyToContent != null &&
      message.replyToCreatedAt != null
        ? {
            id: message.replyToId,
            author:
              message.replyToAuthorId != null &&
              message.replyToAuthorName != null &&
              message.replyToAuthorSurname != null
                ? {
                    id: message.replyToAuthorId,
                    name: message.replyToAuthorName,
                    surname: message.replyToAuthorSurname,
                  }
                : null,
            content: message.replyToContent,
            createdAt: message.replyToCreatedAt.toISOString(),
          }
        : null,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      surname: message.sender.surname,
    },
  };
};
