import type { NotificationPayload } from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { queryClient } from "@/lib/react-query";

export const notificationKeys = {
  all: ["notifications"] as const,
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
  queryClient.setQueryData<NotificationPayload[]>(
    notificationKeys.all,
    (notifications = []) =>
      notifications.map((notification) =>
        notification.id === updatedNotification.id
          ? updatedNotification
          : notification,
      ),
  );
};

export const addNotificationToCache = (notification: NotificationPayload) => {
  queryClient.setQueryData<NotificationPayload[]>(
    notificationKeys.all,
    (notifications = []) => {
      if (notifications.some((item) => item.id === notification.id)) {
        return notifications;
      }

      return [notification, ...notifications];
    },
  );
};

export const useGetNotifications = () => {
  return useQuery({
    queryFn: getNotifications,
    queryKey: notificationKeys.all,
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
        notificationKeys.all,
        (notifications = []) =>
          notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
      );
    },
  });
};
