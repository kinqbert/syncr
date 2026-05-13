import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConversationsRepository } from "src/repositories/conversations.repository";
import { MessagesRepository } from "src/repositories/messages.repository";
import { UsersRepository } from "src/repositories/users.repository";

import {
  CreateDirectConversationDto,
  CreateGroupConversationDto,
  SendMessageDto,
} from "./conversations.dto";
import { ConversationsGateway } from "./conversations.gateway";
import {
  mapConversationMessageToDto,
  mapCreatedMessageToPayload,
  mapListConversationToDto,
} from "./conversations.mapper";

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly messagesRepository: MessagesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly conversationsGateway: ConversationsGateway,
  ) {}

  async getUserConversationsList(userId: number, companyId: number) {
    const conversations = await this.conversationsRepository.getUserConversationsList(
      userId,
      companyId,
    );

    return conversations.map(mapListConversationToDto);
  }

  async getConversationHistory(
    conversationId: number,
    userId: number,
    limit: number,
    offset: number,
  ) {
    await this.ensureConversationParticipant(conversationId, userId);

    const validatedLimit = this.getValidHistoryLimit(limit);
    const validatedOffset = this.getValidHistoryOffset(offset);
    const messages = await this.messagesRepository.getConversationMessages(
      conversationId,
      validatedLimit,
      validatedOffset,
    );

    return {
      items: messages.slice(0, validatedLimit).map(mapConversationMessageToDto),
      hasMore: messages.length > validatedLimit,
    };
  }

  async createDirectConversation(
    userId: number,
    companyId: number,
    dto: CreateDirectConversationDto,
  ) {
    await this.ensureUserInCompany(dto.targetUserId, companyId);
    await this.ensureNoDuplicateConversation(userId, dto.targetUserId);

    const conversation = await this.conversationsRepository.createDirectConversation(
      userId,
      companyId,
      dto.targetUserId,
    );

    return mapListConversationToDto(conversation);
  }

  async createGroupConversation(
    userId: number,
    companyId: number,
    dto: CreateGroupConversationDto,
  ) {
    const participantIds = Array.from(new Set([userId, ...dto.targetUserIds]));

    await this.ensureUsersInCompany(participantIds, companyId);

    const conversation = await this.conversationsRepository.createGroupConversation(
      userId,
      companyId,
      participantIds,
      dto.title,
    );

    return mapListConversationToDto(conversation);
  }

  async sendMessage(conversationId: number, userId: number, dto: SendMessageDto) {
    await this.ensureConversationParticipant(conversationId, userId);

    const message = await this.messagesRepository.createMessage(
      conversationId,
      userId,
      dto.content,
    );

    const rawPayload = await this.messagesRepository.getMessagePayloadData(message.id);
    const payload = mapCreatedMessageToPayload(rawPayload);
    const participantUserIds =
      await this.conversationsRepository.getConversationParticipantIds(conversationId);

    this.conversationsGateway.emitConversationMessageCreated(participantUserIds, payload);

    return payload;
  }

  async markConversationRead(conversationId: number, userId: number) {
    await this.ensureConversationParticipant(conversationId, userId);
    await this.conversationsRepository.markConversationRead(conversationId, userId);
  }

  // HELPERS
  private async ensureNoDuplicateConversation(firstUserId: number, secondUserId: number) {
    const exists = await this.conversationsRepository.checkIfExistsByConversationKey(
      firstUserId,
      secondUserId,
    );

    if (exists) {
      throw new UnauthorizedException("The conversation already exists");
    }
  }

  private async ensureUserInCompany(userId: number, companyId: number) {
    const isInCompany = await this.usersRepository.isUserInCompany(userId, companyId);

    if (!isInCompany) {
      throw new UnauthorizedException("User does not belong to the company");
    }
  }

  private async ensureUsersInCompany(userIds: number[], companyId: number) {
    const allInCompany = await this.usersRepository.areUsersInCompany(userIds, companyId);

    if (!allInCompany) {
      throw new UnauthorizedException("Some of users do not belong to the company");
    }
  }

  private async ensureConversationParticipant(conversationId: number, userId: number) {
    const belongs = await this.conversationsRepository.isConversationParticipant(
      conversationId,
      userId,
    );

    if (!belongs) {
      throw new UnauthorizedException("User does not have access to this conversation");
    }
  }

  private getValidHistoryLimit(value: number) {
    if (!Number.isInteger(value) || value < 1) {
      throw new BadRequestException("Limit must be a positive number");
    }

    return Math.min(value, 100);
  }

  private getValidHistoryOffset(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new BadRequestException("Offset must be a non-negative number");
    }

    return value;
  }
}
