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

export const useNotificationEvent = (
  handler: ServerToClientEvents["notification"],
  enabled = true,
) => {
  const socket = useNotificationsSocket();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [enabled, handler, socket]);
};
