import { Injectable } from "@nestjs/common";
import { and, desc, eq, isNull } from "drizzle-orm";

import db from "../db/drizzle";
import { messages, users } from "../db/schema";

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
};

@Injectable()
export class MessagesRepository {
  async getConversationMessages(conversationId: number, limit: number, offset: number) {
    const conversationMessages = await db
      .select(conversationMessageColumns)
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(and(eq(messages.conversationId, conversationId), isNull(messages.deletedAt)))
      .orderBy(desc(messages.createdAt), desc(messages.id))
      .limit(limit + 1)
      .offset(offset);

    return conversationMessages;
  }

  async createMessage(conversationId: number, senderId: number, content: string) {
    const [message] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId,
        content,
      })
      .returning();

    return message;
  }

  async getMessagePayloadData(messageId: number) {
    const [payload] = await db
      .select({
        id: messages.id,
        content: messages.content,
        createdAt: messages.createdAt,
        conversationId: messages.conversationId,

        sender: {
          id: users.id,
          name: users.name,
          surname: users.surname,
        },
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.id, messageId));

    return payload;
  }
}
