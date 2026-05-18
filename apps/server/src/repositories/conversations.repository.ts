import { Injectable } from "@nestjs/common";
import { ConversationType } from "@syncr/packages";
import { and, desc, eq, isNotNull, isNull, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { ListConversationQueryData } from "src/modules/conversations/conversations.mapper";
import { buildDirectConversationKey } from "src/utils/buildDirectConversationKey";

import { DbProvider } from "../db/db.provider";
import { conversationParticipants, conversations, messages, users } from "../db/schema";
import { BaseRepository } from "./base.repository";

const otherParticipants = alias(conversationParticipants, "other_participants");
const otherUsers = alias(users, "other_users");
const lastMessages = alias(messages, "last_messages");

@Injectable()
export class ConversationsRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async getUserConversationsList(
    userId: number,
    companyId: number,
  ): Promise<ListConversationQueryData[]> {
    const userConversations = await this.db
      .select({
        conversation: conversations,
        otherUser: {
          id: otherUsers.id,
          name: otherUsers.name,
          surname: otherUsers.surname,
        },
        unreadCount: sql<number>`(
            select count(*)::int
            from messages
            where messages.conversation_id = ${conversations.id}
              and messages.deleted_at is null
              and messages.sender_id <> ${userId}
              and messages.created_at >= ${conversationParticipants.joinedAt}
              and (
                ${conversationParticipants.lastReadMessageId} is null
                or messages.id > ${conversationParticipants.lastReadMessageId}
              )
          )
        `.mapWith(Number),
      })

      .from(conversationParticipants)
      .innerJoin(
        conversations,

        and(
          eq(conversationParticipants.conversationId, conversations.id),
          eq(conversations.companyId, companyId),
        ),
      )

      // SECOND PARTICIPANT ROW
      .leftJoin(
        otherParticipants,

        and(
          eq(otherParticipants.conversationId, conversations.id),
          eq(conversations.type, ConversationType.Direct),
          ne(otherParticipants.userId, userId),
        ),
      )

      // OTHER USER
      .leftJoin(otherUsers, eq(otherParticipants.userId, otherUsers.id))

      // ORDER BY LATEST ACTIVITY
      .leftJoin(lastMessages, eq(conversations.lastMessageId, lastMessages.id))
      .where(
        and(eq(conversationParticipants.userId, userId), isNotNull(conversations.lastMessageId)),
      )
      .orderBy(
        desc(sql`coalesce(${lastMessages.createdAt}, ${conversations.createdAt})`),
        desc(conversations.id),
      );
    return userConversations;
  }

  async getConversationById(conversationId: number) {
    const [conversation] = await this.db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    return conversation;
  }

  async markConversationRead(conversationId: number, userId: number) {
    const [latestMessage] = await this.db
      .select({ id: messages.id })
      .from(messages)
      .where(and(eq(messages.conversationId, conversationId), isNull(messages.deletedAt)))
      .orderBy(desc(messages.id))
      .limit(1);

    await this.db
      .update(conversationParticipants)
      .set({ lastReadMessageId: latestMessage?.id ?? null })
      .where(
        and(
          eq(conversationParticipants.conversationId, conversationId),
          eq(conversationParticipants.userId, userId),
        ),
      );
  }

  async getConversationParticipantIds(conversationId: number) {
    const rows = await this.db
      .select({ userId: conversationParticipants.userId })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, conversationId));

    return rows.map((row) => row.userId);
  }

  async createDirectConversation(
    userId: number,
    companyId: number,
    targetUserId: number,
  ): Promise<ListConversationQueryData> {
    const directConversationKey = buildDirectConversationKey(userId, targetUserId);

    const newConversationData = await this.db.transaction(async (tx) => {
      const [createdConversation] = await tx
        .insert(conversations)
        .values({
          companyId,
          type: ConversationType.Direct,
          createdById: userId,
          directConversationKey,
        })
        .onConflictDoNothing({ target: conversations.directConversationKey })
        .returning();

      const conversation =
        createdConversation ??
        (
          await tx
            .select()
            .from(conversations)
            .where(eq(conversations.directConversationKey, directConversationKey))
            .limit(1)
        )[0];

      if (!conversation) {
        throw new Error("Could not create or resolve direct conversation");
      }

      if (createdConversation) {
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
      }

      const [targetUser] = await tx.select().from(users).where(eq(users.id, targetUserId));

      return {
        conversation,
        otherUser: targetUser,
        unreadCount: 0,
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
    const newConversationData = await this.db.transaction(async (tx) => {
      const [conversation] = await tx
        .insert(conversations)
        .values({
          companyId,
          type: ConversationType.Group,
          title,
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
        otherUser: null,
        unreadCount: 0,
      };
    });

    return newConversationData;
  }

  async isConversationParticipant(conversationId: number, userId: number) {
    const participant = await this.db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId),
      ),
    });

    return Boolean(participant);
  }
}
