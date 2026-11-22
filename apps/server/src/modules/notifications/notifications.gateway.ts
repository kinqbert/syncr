import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import type { NotificationPayload } from "@syncr/packages";

import { type AppServer, SOCKET_GATEWAY_OPTIONS, userRoom } from "../realtime/socket";

@WebSocketGateway(SOCKET_GATEWAY_OPTIONS)
export class NotificationsGateway {
  @WebSocketServer()
  server: AppServer;

  sendNotification(userId: number, payload: NotificationPayload) {
    this.server.to(userRoom(userId)).emit("notification", payload);
  }
}
