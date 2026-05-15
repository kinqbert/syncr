import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { ClientToServerEvents, MessagePayload, ServerToClientEvents } from "@syncr/packages";
import { parse as parseCookie } from "cookie";
import { Server, Socket } from "socket.io";

import { COOKIE_PARAM } from "../../common/constants/cookie-param";
import { verifyAccessToken } from "../../common/utils/jwt";
import { CONFIG } from "../../config/configuration";
import { AuthRepository } from "../../repositories/auth.repository";
import { ConversationsRepository } from "../../repositories/conversations.repository";

type ConversationSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

type ConversationSocketData = {
  userId?: unknown;
};

@WebSocketGateway({
  cors: {
    origin: CONFIG.CLIENT_URL,
    credentials: true,
  },
})
export class ConversationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly conversationsRepository: ConversationsRepository,
  ) {}

  async handleConnection(client: ConversationSocket) {
    try {
      const cookies = parseCookie(client.handshake.headers.cookie ?? "");

      const accessToken = cookies[COOKIE_PARAM.accessToken];
      const sessionId = cookies[COOKIE_PARAM.sessionId];

      if (!accessToken || !sessionId) {
        client.disconnect();
        return;
      }

      const payload = verifyAccessToken(accessToken);
      const userSession = await this.authRepository.findSessionById(sessionId);

      if (
        !userSession ||
        userSession.userId !== payload.userId ||
        new Date(userSession.expiresAt) < new Date()
      ) {
        client.disconnect();
        return;
      }

      this.setSocketUserId(client, payload.userId);

      await client.join(this.getUserRoom(payload.userId));
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage("conversation.join")
  async handleConversationJoin(
    @ConnectedSocket()
    client: ConversationSocket,

    @MessageBody()
    payload: {
      conversationId: number;
    },
  ) {
    const userId = this.getSocketUserId(client);

    if (
      userId == null ||
      !(await this.conversationsRepository.isConversationParticipant(
        payload.conversationId,
        userId,
      ))
    ) {
      return;
    }

    const room = `conversation:${payload.conversationId}`;

    await client.join(room);
  }

  @SubscribeMessage("conversation.leave")
  async handleConversationLeave(
    @ConnectedSocket()
    client: ConversationSocket,

    @MessageBody()
    payload: {
      conversationId: number;
    },
  ) {
    const room = `conversation:${payload.conversationId}`;

    await client.leave(room);
  }

  @SubscribeMessage("typing.started")
  async handleTypingStarted(
    @ConnectedSocket()
    client: ConversationSocket,

    @MessageBody()
    payload: {
      conversationId: number;
    },
  ) {
    await this.emitTypingState(client, payload.conversationId, "typing.started");
  }

  @SubscribeMessage("typing.stopped")
  async handleTypingStopped(
    @ConnectedSocket()
    client: ConversationSocket,

    @MessageBody()
    payload: {
      conversationId: number;
    },
  ) {
    await this.emitTypingState(client, payload.conversationId, "typing.stopped");
  }

  emitMessageCreated(conversationId: number, message: MessagePayload) {
    this.server.to(`conversation:${conversationId}`).emit("message.created", message);
  }

  emitTypingStarted(
    conversationId: number,
    payload: {
      userId: number;
    },
  ) {
    this.server.to(`conversation:${conversationId}`).emit("typing.started", {
      conversationId,
      userId: payload.userId,
    });
  }

  emitTypingStopped(
    conversationId: number,
    payload: {
      userId: number;
    },
  ) {
    this.server.to(`conversation:${conversationId}`).emit("typing.stopped", {
      conversationId,
      userId: payload.userId,
    });
  }

  emitConversationMessageCreated(participantUserIds: number[], message: MessagePayload) {
    for (const userId of participantUserIds) {
      this.server.to(this.getUserRoom(userId)).emit("message.created", message);
    }
  }

  private getUserRoom(userId: number) {
    return `user:${userId}`;
  }

  private async emitTypingState(
    client: ConversationSocket,
    conversationId: number,
    event: "typing.started" | "typing.stopped",
  ) {
    const userId = this.getSocketUserId(client);

    if (
      userId == null ||
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

      this.server.to(this.getUserRoom(participantUserId)).emit(event, {
        conversationId,
        userId,
      });
    }
  }

  private getSocketUserId(client: ConversationSocket) {
    const data = client.data as ConversationSocketData;

    return typeof data.userId === "number" ? data.userId : null;
  }

  private setSocketUserId(client: ConversationSocket, userId: number) {
    const data = client.data as ConversationSocketData;

    data.userId = userId;
  }
}
