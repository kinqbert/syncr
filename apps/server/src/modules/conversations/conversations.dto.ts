import {
  ConversationHistoryPage,
  ConversationMessage,
  ConversationMessageAuthor,
  ConversationType,
  CreateDirectConversationBody,
  CreateGroupConversationBody,
  ListConversation,
  MessageResponse,
  SendMessageBody,
} from "@syncr/packages";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

class ListConversationMessageDto {
  @IsString()
  authorName: string;

  @IsString()
  content: string;
}

export class ListConversationDto implements ListConversation {
  @IsNumber()
  id: number;

  @IsEnum(ConversationType)
  type: ConversationType;

  @IsString()
  title: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => ListConversationMessageDto)
  lastMessage?: { authorName: string; content: string };
}

class ConversationMessageAuthorDto implements ConversationMessageAuthor {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  surname: string;
}

export class ConversationMessageDto implements ConversationMessage {
  @IsInt()
  id: number;

  @IsInt()
  conversationId: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => ConversationMessageAuthorDto)
  author: ConversationMessageAuthorDto | null;

  @IsString()
  content: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  @IsOptional()
  editedAt: string | null;
}

export class ConversationHistoryPageDto implements ConversationHistoryPage {
  @ValidateNested({ each: true })
  @Type(() => ConversationMessageDto)
  items: ConversationMessageDto[];

  @IsBoolean()
  hasMore: boolean;
}

export class CreateDirectConversationDto implements CreateDirectConversationBody {
  @IsInt()
  targetUserId: number;
}

export class CreateGroupConversationDto implements CreateGroupConversationBody {
  @IsString()
  title: string;

  @IsArray()
  @IsNumber({}, { each: true })
  targetUserIds: number[];
}

export class SendMessageDto implements SendMessageBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content: string;
}

export class MessageSenderResponseDto {
  id: number;
  name: string;
  surname: string;
}

export class MessageResponseDto implements MessageResponse {
  id: number;
  content: string;
  conversationId: number;
  createdAt: string;
  sender: MessageSenderResponseDto;
}
