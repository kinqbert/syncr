import type { ServerToClientEvents } from "@syncr/packages";
import { useContext, useEffect } from "react";

import { SocketContext } from "@/context/SocketContext/SocketContext";

export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used within SocketProvider");
  }

  return socket;
};

export const useNotificationEvent = (
  handler: ServerToClientEvents["notification"],
  enabled = true,
) => {
  const socket = useSocket();

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
