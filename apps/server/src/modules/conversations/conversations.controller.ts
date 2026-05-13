import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CompanyId } from "src/common/decorators/company-id.decorator";
import { UserId } from "src/common/decorators/user-id.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

import {
  ConversationHistoryPageDto,
  CreateDirectConversationDto,
  CreateGroupConversationDto,
  ListConversationDto,
  MessageResponseDto,
  SendMessageDto,
} from "./conversations.dto";
import { ConversationsService } from "./conversations.service";

@Controller("conversations")
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get("list")
  @HttpCode(HttpStatus.OK)
  async getConversationsList(
    @UserId() userId: number,
    @CompanyId() companyId: number,
  ): Promise<ListConversationDto[]> {
    return await this.conversationsService.getUserConversationsList(userId, companyId);
  }

  @Post("direct")
  @HttpCode(HttpStatus.OK)
  async createDirectConversation(
    @UserId() userId: number,
    @CompanyId() companyId: number,
    @Body() createDirectConversationDto: CreateDirectConversationDto,
  ): Promise<ListConversationDto> {
    return await this.conversationsService.createDirectConversation(
      userId,
      companyId,
      createDirectConversationDto,
    );
  }

  @Post("group")
  @HttpCode(HttpStatus.OK)
  async createGroupConversation(
    @UserId() userId: number,
    @CompanyId() companyId: number,
    @Body() createDirectConversationDto: CreateGroupConversationDto,
  ): Promise<ListConversationDto> {
    return await this.conversationsService.createGroupConversation(
      userId,
      companyId,
      createDirectConversationDto,
    );
  }

  @Get(":conversationId/history")
  @HttpCode(HttpStatus.OK)
  async getConversationHistory(
    @Param("conversationId", ParseIntPipe) conversationId: number,
    @UserId() userId: number,
    @Query("limit", new DefaultValuePipe(30), ParseIntPipe) limit: number,
    @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<ConversationHistoryPageDto> {
    return await this.conversationsService.getConversationHistory(
      conversationId,
      userId,
      limit,
      offset,
    );
  }

  @Post(":conversationId/message")
  @HttpCode(HttpStatus.OK)
  async sendMEssage(
    @Param("conversationId", ParseIntPipe) conversationId: number,
    @UserId() userId: number,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    return await this.conversationsService.sendMessage(conversationId, userId, sendMessageDto);
  }

  @Patch(":conversationId/read")
  @HttpCode(HttpStatus.NO_CONTENT)
  async markConversationRead(
    @Param("conversationId", ParseIntPipe) conversationId: number,
    @UserId() userId: number,
  ) {
    await this.conversationsService.markConversationRead(conversationId, userId);
  }
}
