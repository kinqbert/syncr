import { toast } from "sonner";

import { addNotificationToCache } from "@/api/notifications";
import { Notification } from "@/components/Notification";
import { useNotificationEvent } from "@/hooks/sockets";

export const NotificationsListener = () => {
  useNotificationEvent((payload) => {
    addNotificationToCache(payload);
    toast(<Notification notification={payload} />, {
      closeButton: true,
      duration: 100000,
    });
  });

  return null;
};
