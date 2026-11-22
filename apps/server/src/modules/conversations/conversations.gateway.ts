import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { MessagePayload } from "@syncr/packages";

import { ConversationsRepository } from "../../repositories/conversations.repository";
import {
  type AppServer,
  type AppSocket,
  conversationRoom,
  getSocketUserId,
  SOCKET_GATEWAY_OPTIONS,
  userRoom,
} from "../realtime/socket";

type ConversationEventPayload = {
  conversationId: number;
};

@WebSocketGateway(SOCKET_GATEWAY_OPTIONS)
export class ConversationsGateway {
  @WebSocketServer()
  server: AppServer;

  constructor(private readonly conversationsRepository: ConversationsRepository) {}

  @SubscribeMessage("conversation.join")
  async handleConversationJoin(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() payload: ConversationEventPayload,
  ) {
    const userId = getSocketUserId(client);

    if (
      userId === null ||
      !(await this.conversationsRepository.isConversationParticipant(
        payload.conversationId,
        userId,
      ))
    ) {
      return;
    }

    await client.join(conversationRoom(payload.conversationId));
  }

  @SubscribeMessage("conversation.leave")
  async handleConversationLeave(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() payload: ConversationEventPayload,
  ) {
    await client.leave(conversationRoom(payload.conversationId));
  }

  @SubscribeMessage("typing.started")
  async handleTypingStarted(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() payload: ConversationEventPayload,
  ) {
    await this.emitTypingState(client, payload.conversationId, "typing.started");
  }

  @SubscribeMessage("typing.stopped")
  async handleTypingStopped(
    @ConnectedSocket() client: AppSocket,
    @MessageBody() payload: ConversationEventPayload,
  ) {
    await this.emitTypingState(client, payload.conversationId, "typing.stopped");
  }

  emitMessageCreated(conversationId: number, message: MessagePayload) {
    this.server.to(conversationRoom(conversationId)).emit("message.created", message);
  }

  emitTypingStarted(conversationId: number, payload: { userId: number }) {
    this.server.to(conversationRoom(conversationId)).emit("typing.started", {
      conversationId,
      userId: payload.userId,
    });
  }

  emitTypingStopped(conversationId: number, payload: { userId: number }) {
    this.server.to(conversationRoom(conversationId)).emit("typing.stopped", {
      conversationId,
      userId: payload.userId,
    });
  }

  emitConversationMessageCreated(participantUserIds: number[], message: MessagePayload) {
    for (const userId of participantUserIds) {
      this.server.to(userRoom(userId)).emit("message.created", message);
    }
  }

  private async emitTypingState(
    client: AppSocket,
    conversationId: number,
    event: "typing.started" | "typing.stopped",
  ) {
    const userId = getSocketUserId(client);

    if (
      userId === null ||
      !(await this.conversationsRepository.isConversationParticipant(conversationId, userId))
    ) {
      return;
    }

    const participantUserIds =
      await this.conversationsRepository.getConversationParticipantIds(conversationId);

    for (const participantUserId of participantUserIds) {
      if (participantUserId === userId) {
        continue;
      }

      this.server.to(userRoom(participantUserId)).emit(event, {
        conversationId,
        userId,
      });
    }
  }
}
