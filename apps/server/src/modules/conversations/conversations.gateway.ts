import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { MessagePayload } from "@syncr/packages";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class ConversationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection() {}

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
}
