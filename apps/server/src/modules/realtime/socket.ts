import type { GatewayMetadata } from "@nestjs/websockets";
import type { ClientToServerEvents, ServerToClientEvents } from "@syncr/packages";
import type { Server, Socket } from "socket.io";

import { isDemo } from "../../common/demo";
import { CLIENT_ORIGINS } from "../../config/configuration";

export type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export type SocketUser = {
  userId: number;
  isDemo: boolean;
};

export const SOCKET_GATEWAY_OPTIONS: GatewayMetadata = {
  cors: {
    origin: CLIENT_ORIGINS,
    credentials: true,
  },
};

// demo ids overlap with real ones since they live in a separate database, so their rooms are prefixed
const DEMO_ROOM_PREFIX = "demo:";

const scopedRoom = (room: string, demo: boolean) => (demo ? `${DEMO_ROOM_PREFIX}${room}` : room);

export const userRoom = (userId: number, demo = isDemo()) => scopedRoom(`user:${userId}`, demo);

export const companyRoom = (companyId: number, demo = isDemo()) =>
  scopedRoom(`company:${companyId}`, demo);

export const conversationRoom = (conversationId: number, demo = isDemo()) =>
  scopedRoom(`conversation:${conversationId}`, demo);

export const isCompanyRoom = (room: string) => /^(demo:)?company:/.test(room);

export const isDemoUserRoom = (room: string) => room.startsWith(`${DEMO_ROOM_PREFIX}user:`);

export const getSocketUser = (client: AppSocket) => {
  const user = (client.data as { user?: SocketUser }).user;

  return user ?? null;
};

export const setSocketUser = (client: AppSocket, user: SocketUser) => {
  (client.data as { user?: SocketUser }).user = user;
};
