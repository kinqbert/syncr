import type { NotificationPayload } from "@syncr/packages";
import { io, type Socket } from "socket.io-client";

import { env } from "./env";

export type ServerToClientEvents = {
  notification: (payload: NotificationPayload) => void;
};

export type ClientToServerEvents = Record<string, never>;

export type NotificationSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

export const createNotificationSocket = (): NotificationSocket => {
  return io(env.socketUrl, {
    autoConnect: false,
    transports: ["websocket"],
    withCredentials: true,
  });
};
