import { createContext } from "react";

import type { AppSocket } from "@/lib/socket";

export const SocketContext = createContext<AppSocket | null>(null);
