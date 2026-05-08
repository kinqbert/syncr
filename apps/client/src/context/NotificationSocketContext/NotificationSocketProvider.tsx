import { type ReactNode, useEffect, useMemo } from "react";

import { NotificationSocketContext } from "@/context/NotificationSocketContext/NotificationSocketContext";
import { createNotificationSocket } from "@/lib/socket";

export const NotificationsSocketProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const socket = useMemo(() => createNotificationSocket(), []);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [socket]);

  return (
    <NotificationSocketContext.Provider value={socket}>
      {children}
    </NotificationSocketContext.Provider>
  );
};
