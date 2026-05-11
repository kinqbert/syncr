import { useEffect } from "react";

import { socket } from "@/lib/socket";

import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }: React.PropsWithChildren) => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
