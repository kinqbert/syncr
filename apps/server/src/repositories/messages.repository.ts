import { Injectable } from "@nestjs/common";
import { and, desc, eq, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import db from "../db/drizzle";
import { conversations, messages, users } from "../db/schema";

const replyMessages = alias(messages, "reply_messages");
const replyUsers = alias(users, "reply_users");

const conversationMessageColumns = {
  id: messages.id,
  conversationId: messages.conversationId,
  senderId: messages.senderId,
  content: messages.content,
  createdAt: messages.createdAt,
  editedAt: messages.editedAt,
  user: {
    id: users.id,
    name: users.name,
    surname: users.surname,
  },
  replyToId: replyMessages.id,
  replyToContent: replyMessages.content,
  replyToCreatedAt: replyMessages.createdAt,
  replyToAuthorId: replyUsers.id,
  replyToAuthorName: replyUsers.name,
  replyToAuthorSurname: replyUsers.surname,
};

@Injectable()
export class MessagesRepository {
  async getConversationMessages(conversationId: number, limit: number, offset: number) {
    const conversationMessages = await db
      .select(conversationMessageColumns)
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .leftJoin(replyMessages, eq(messages.replyToMessageId, replyMessages.id))
      .leftJoin(replyUsers, eq(replyMessages.senderId, replyUsers.id))
      .where(and(eq(messages.conversationId, conversationId), isNull(messages.deletedAt)))
      .orderBy(desc(messages.createdAt), desc(messages.id))
      .limit(limit + 1)
      .offset(offset);

    return conversationMessages;
  }

  async createMessage(
    conversationId: number,
    senderId: number,
    content: string,
    replyToMessageId: number | null,
  ) {
    return await db.transaction(async (tx) => {
      const [message] = await tx
        .insert(messages)
        .values({
          conversationId,
          senderId,
          replyToMessageId,
          content,
        })
        .returning();

      await tx
        .update(conversations)
        .set({
          lastMessageId: message.id,
          updatedAt: message.createdAt,
        })
        .where(eq(conversations.id, conversationId));

      return message;
    });
  }

  async getMessagePayloadData(messageId: number) {
    const [payload] = await db
      .select({
        id: messages.id,
        content: messages.content,
        createdAt: messages.createdAt,
        conversationId: messages.conversationId,
        replyToId: replyMessages.id,
        replyToContent: replyMessages.content,
        replyToCreatedAt: replyMessages.createdAt,
        replyToAuthorId: replyUsers.id,
        replyToAuthorName: replyUsers.name,
        replyToAuthorSurname: replyUsers.surname,

        sender: {
          id: users.id,
          name: users.name,
          surname: users.surname,
        },
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .leftJoin(replyMessages, eq(messages.replyToMessageId, replyMessages.id))
      .leftJoin(replyUsers, eq(replyMessages.senderId, replyUsers.id))
      .where(eq(messages.id, messageId));

    return payload;
  }

  async getConversationMessageReference(messageId: number, conversationId: number) {
    const [message] = await db
      .select({ id: messages.id })
      .from(messages)
      .where(
        and(
          eq(messages.id, messageId),
          eq(messages.conversationId, conversationId),
          isNull(messages.deletedAt),
        ),
      )
      .limit(1);

    return message;
  }
}
