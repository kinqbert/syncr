import type { NotificationPayload } from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { useCompanyStore } from "@/store/useCompanyStore";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (companyId: number | null) => [...notificationKeys.all, companyId] as const,
};

const getNotifications = async () => {
  const response = await api.get<NotificationPayload[]>("notifications");

  return response.data;
};

const markNotificationAsRead = async (notificationId: number) => {
  const response = await api.patch<NotificationPayload>(
    `notifications/${notificationId}/read`,
  );

  return response.data;
};

const markAllNotificationsRead = async () => {
  const response = await api.patch<NotificationPayload[]>("notifications/read");

  return response.data;
};

export const updateNotificationInCache = (updatedNotification: NotificationPayload) => {
  queryClient.setQueriesData<NotificationPayload[]>(
    { queryKey: notificationKeys.all },
    (notifications = []) =>
      notifications.map((notification) =>
        notification.id === updatedNotification.id
          ? updatedNotification
          : notification,
      ),
  );
};

export const addNotificationToCache = (notification: NotificationPayload) => {
  const selectedCompanyId = useCompanyStore.getState().selectedCompanyId;

  if (notification.companyId !== null && notification.companyId !== selectedCompanyId) {
    return;
  }

  const addToList = (notifications: NotificationPayload[] = []) => {
    if (notifications.some((item) => item.id === notification.id)) {
      return notifications;
    }

    return [notification, ...notifications];
  };

  if (notification.companyId === null) {
    queryClient.setQueriesData<NotificationPayload[]>(
      { queryKey: notificationKeys.all },
      addToList,
    );
    return;
  }

  queryClient.setQueryData<NotificationPayload[]>(
    notificationKeys.list(selectedCompanyId),
    addToList,
  );
};

export const useGetNotifications = () => {
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);

  return useQuery({
    queryFn: getNotifications,
    queryKey: notificationKeys.list(selectedCompanyId),
  });
};

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (updatedNotification) => {
      updateNotificationInCache(updatedNotification);
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationPayload[]>(
        notificationKeys.list(useCompanyStore.getState().selectedCompanyId),
        (notifications = []) =>
          notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
      );
    },
  });
};
