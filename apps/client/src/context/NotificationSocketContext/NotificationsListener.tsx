import { toast } from "sonner";

import { addNotificationToCache } from "@/api/notifications";
import { Notification } from "@/components/Notification";
import { useNotificationEvent } from "@/hooks/sockets";

// TODO -- replace with react toastify
export const NotificationsListener = () => {
  useNotificationEvent((payload) => {
    addNotificationToCache(payload);
    toast(<Notification notification={payload} />, { duration: 100000 });
  });

  return null;
};
