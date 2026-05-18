import { useEffect } from "react";

import { isDemoView } from "@/lib/demo";
import { socket } from "@/lib/socket";

import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }: React.PropsWithChildren) => {
  useEffect(() => {
    // todo: turn this on and implement random events
    if (isDemoView()) {
      return;
    }

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
