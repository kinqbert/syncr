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
}
