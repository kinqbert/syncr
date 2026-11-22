import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@syncr/packages";
import { io, type Socket } from "socket.io-client";

import { isDemoView } from "./demo";
import { env } from "./env";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const socket: AppSocket = io(env.socketUrl, {
  autoConnect: false,
  auth: { demo: isDemoView() },
  transports: ["websocket"],
  withCredentials: true,
});
