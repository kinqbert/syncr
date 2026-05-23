import { toast } from "sonner";

import { addNotificationToCache } from "@/api/notifications";
import { Notification } from "@/components/Notification";
import { useNotificationEvent } from "@/hooks/sockets";
import { useCompanyStore } from "@/store/useCompanyStore";

export const NotificationsListener = () => {
  useNotificationEvent((payload) => {
    const selectedCompanyId = useCompanyStore.getState().selectedCompanyId;

    if (payload.companyId !== null && payload.companyId !== selectedCompanyId) {
      return;
    }

    addNotificationToCache(payload);
    toast(<Notification notification={payload} />, {
      closeButton: true,
      duration: 100000,
    });
  });

  return null;
};
