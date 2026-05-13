import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { MessagePayload } from "@syncr/packages";
import { parse as parseCookie } from "cookie";
import { Server, Socket } from "socket.io";

import { COOKIE_PARAM } from "../../common/constants/cookie-param";
import { verifyAccessToken } from "../../common/utils/jwt";
import { CONFIG } from "../../config/configuration";
import { AuthRepository } from "../../repositories/auth.repository";

@WebSocketGateway({
  cors: {
    origin: CONFIG.CLIENT_URL,
    credentials: true,
  },
})
export class ConversationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly authRepository: AuthRepository) {}

  async handleConnection(client: Socket) {
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

      client.data.userId = payload.userId;

      await client.join(this.getUserRoom(payload.userId));
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage("conversation.join")
  async handleConversationJoin(
    @ConnectedSocket()
    client: Socket,

    @MessageBody()
    payload: {
      conversationId: number;
    },
  ) {
    const room = `conversation:${payload.conversationId}`;

    await client.join(room);
  }

  @SubscribeMessage("conversation.leave")
  async handleConversationLeave(
    @ConnectedSocket()
    client: Socket,

    @MessageBody()
    payload: {
      conversationId: number;
    },
  ) {
    const room = `conversation:${payload.conversationId}`;

    await client.leave(room);
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
    this.server.to(`conversation:${conversationId}`).emit("typing.started", payload);
  }

  emitTypingStopped(
    conversationId: number,
    payload: {
      userId: number;
    },
  ) {
    this.server.to(`conversation:${conversationId}`).emit("typing.stopped", payload);
  }

  emitConversationMessageCreated(participantUserIds: number[], message: MessagePayload) {
    for (const userId of participantUserIds) {
      this.server.to(this.getUserRoom(userId)).emit("message.created", message);
    }
  }

  private getUserRoom(userId: number) {
    return `user:${userId}`;
  }
}
