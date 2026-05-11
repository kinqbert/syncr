import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { ConversationsRepository } from "src/repositories/conversations.repository";
import { MessagesRepository } from "src/repositories/messages.repository";
import { UsersRepository } from "src/repositories/users.repository";

import { ConversationsController } from "./conversations.controller";
import { ConversationsGateway } from "./conversations.gateway";
import { ConversationsService } from "./conversations.service";

@Module({
  providers: [
    ConversationsService,
    ConversationsGateway,
    ConversationsRepository,
    MessagesRepository,
    JwtAuthGuard,
    AuthRepository,
    UsersRepository,
  ],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
