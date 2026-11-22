import type { GatewayMetadata } from "@nestjs/websockets";
import type { ClientToServerEvents, ServerToClientEvents } from "@syncr/packages";
import type { Server, Socket } from "socket.io";

import { CONFIG } from "../../config/configuration";

export type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

type SocketData = {
  userId?: unknown;
};

export const SOCKET_GATEWAY_OPTIONS: GatewayMetadata = {
  cors: {
    origin: CONFIG.CLIENT_URL,
    credentials: true,
  },
};

export const userRoom = (userId: number) => `user:${userId}`;
export const companyRoom = (companyId: number) => `company:${companyId}`;
export const conversationRoom = (conversationId: number) => `conversation:${conversationId}`;

export const isCompanyRoom = (room: string) => room.startsWith("company:");

export const getSocketUserId = (client: AppSocket) => {
  const data = client.data as SocketData;

  return typeof data.userId === "number" ? data.userId : null;
};

export const setSocketUserId = (client: AppSocket, userId: number) => {
  (client.data as SocketData).userId = userId;
};
