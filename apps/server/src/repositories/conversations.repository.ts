import { Injectable } from "@nestjs/common";
import { ConversationType } from "@syncr/packages";
import { and, eq, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { ListConversationQueryData } from "src/modules/conversations/conversations.mapper";
import { buildDirectConversationKey } from "src/utils/buildDirectConversationKey";

import db from "../db/drizzle";
import { conversationParticipants, conversations, messages, users } from "../db/schema";

const otherParticipants = alias(conversationParticipants, "other_participants");
const otherUsers = alias(users, "other_users");
const messageSenders = alias(users, "message_senders");

@Injectable()
export class ConversationsRepository {
  async getUserConversationsList(
    userId: number,
    companyId: number,
  ): Promise<ListConversationQueryData[]> {
    const userConversations = await db
      .select({
        conversation: conversations,
        lastMessage: messages,
        otherUser: {
          id: otherUsers.id,
          name: otherUsers.name,
          surname: otherUsers.surname,
        },
        lastMessageSender: {
          id: messageSenders.id,
          name: messageSenders.name,
          surname: messageSenders.surname,
        },
      })

      .from(conversationParticipants)
      .innerJoin(
        conversations,

        and(
          eq(conversationParticipants.conversationId, conversations.id),
          eq(conversations.companyId, companyId),
        ),
      )
      .leftJoin(messages, eq(conversations.lastMessageId, messages.id))
      .leftJoin(messageSenders, eq(messages.senderId, messageSenders.id))

      // SECOND PARTICIPANT ROW
      .leftJoin(
        otherParticipants,

        and(
          eq(otherParticipants.conversationId, conversations.id),
          ne(otherParticipants.userId, userId),
        ),
      )

      // OTHER USER
      .leftJoin(otherUsers, eq(otherParticipants.userId, otherUsers.id))
      .where(eq(conversationParticipants.userId, userId));

    return userConversations;
  }

  async getConversationById(conversationId: number) {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    return conversation;
  }

  // async getConversationByConversationKey(firstUserId: number, secondUserId: number) {
  //   const conversationKey = buildDirectConversationKey(firstUserId, secondUserId);

  //   const [conversation] = await db
  //     .select({ id: conversations.id })
  //     .from(conversations)
  //     .where(eq(conversations.directConversationKey, conversationKey));

  //   return conversation;
  // }

  async checkIfExistsByConversationKey(firstUserId: number, secondUserId: number) {
    const conversationKey = buildDirectConversationKey(firstUserId, secondUserId);

    const [conversation] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.directConversationKey, conversationKey))
      .limit(1);

    return Boolean(conversation);
  }

  async createDirectConversation(
    userId: number,
    companyId: number,
    targetUserId: number,
  ): Promise<ListConversationQueryData> {
    const newConversationData = await db.transaction(async (tx) => {
      const [conversation] = await tx
        .insert(conversations)
        .values({
          companyId,
          type: ConversationType.Direct,
          createdById: userId,
          directConversationKey: buildDirectConversationKey(userId, targetUserId),
        })
        .returning();

      const conversationParticipantsValues: (typeof conversationParticipants.$inferInsert)[] = [
        {
          conversationId: conversation.id,
          userId: userId,
        },
        {
          conversationId: conversation.id,
          userId: targetUserId,
        },
      ];

      await tx.insert(conversationParticipants).values(conversationParticipantsValues);

      const [targetUser] = await tx.select().from(users).where(eq(users.id, targetUserId));

      return {
        conversation,
        lastMessage: null,
        otherUser: targetUser,
        lastMessageSender: null,
      };
    });

    return newConversationData;
  }

  async createGroupConversation(
    userId: number,
    companyId: number,
    targetUsersIds: number[],
    title: string,
  ): Promise<ListConversationQueryData> {
    const newConversationData = await db.transaction(async (tx) => {
      const [conversation] = await tx
        .insert(conversations)
        .values({
          companyId,
          type: ConversationType.Group,
          title,
          lastMessageId: null,
          createdById: userId,
        })
        .returning();

      const conversationParticipantsValues: (typeof conversationParticipants.$inferInsert)[] =
        targetUsersIds.map((userId) => ({
          userId,
          conversationId: conversation.id,
        }));

      await tx.insert(conversationParticipants).values(conversationParticipantsValues);

      return {
        conversation,
        lastMessage: null,
        otherUser: null,
        lastMessageSender: null,
      };
    });

    return newConversationData;
  }

  async isConversationParticipant(conversationId: number, userId: number) {
    const participant = await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId),
      ),
    });

    return Boolean(participant);
  }
}
