import { createContext } from "react";

import type { NotificationSocket } from "@/lib/socket";

export const NotificationSocketContext =
  createContext<NotificationSocket | null>(null);
