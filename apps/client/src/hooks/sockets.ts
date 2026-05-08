import { useContext, useEffect } from "react";

import { NotificationSocketContext } from "@/context/NotificationSocketContext/NotificationSocketContext";
import type { ServerToClientEvents } from "@/lib/socket";

export const useNotificationsSocket = () => {
  const socket = useContext(NotificationSocketContext);

  if (!socket) {
    throw new Error(
      "useNotificationsSocket must be used within NotificationsSocketProvider",
    );
  }

  return socket;
};

export const useNotificationsSocketEvent = (
  eventName: keyof ServerToClientEvents,
  handler: ServerToClientEvents[keyof ServerToClientEvents],
  enabled = true,
) => {
  const socket = useNotificationsSocket();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [enabled, eventName, handler, socket]);
};
