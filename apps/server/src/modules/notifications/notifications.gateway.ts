import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import type { NotificationPayload } from "@syncr/packages";
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
export class NotificationsGateway implements OnGatewayConnection {
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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      client.data.userId = payload.userId;

      await client.join(this.getUserRoom(payload.userId));
    } catch {
      client.disconnect();
    }
  }

  sendNotification(userId: number, payload: NotificationPayload) {
    this.server.to(this.getUserRoom(userId)).emit("notification", payload);
  }

  private getUserRoom(userId: number) {
    return `user:${userId}`;
  }
}
