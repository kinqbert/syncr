import type {
  InviteTeamMembersBody,
  NotificationPayload,
  UserInvitation,
} from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { queryClient } from "@/lib/react-query";

import { companiesKeys } from "./companies";
import { notificationKeys } from "./notifications";
import { teamKeys } from "./team";

export const invitationKeys = {
  pending: ["invitations", "pending"] as const,
};

const getPendingInvitations = async () => {
  const response = await api.get<UserInvitation[]>("invitations/pending");

  return response.data;
};

const inviteTeamMembers = async (body: InviteTeamMembersBody) => {
  await api.post("invitations", body);
};

const acceptInvitation = async (invitationId: number) => {
  const response = await api.patch<NotificationPayload | null>(
    `invitations/${invitationId}/accept`,
  );

  return response.data;
};

const declineInvitation = async (invitationId: number) => {
  const response = await api.patch<NotificationPayload | null>(
    `invitations/${invitationId}/decline`,
  );

  return response.data;
};

const updateNotificationInCache = (updatedNotification: NotificationPayload) => {
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

export const useInviteTeamMembers = () => {
  return useMutation({
    mutationFn: inviteTeamMembers,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: teamKeys.team });
    },
  });
};

export const useGetPendingInvitations = () => {
  return useQuery({
    queryFn: getPendingInvitations,
    queryKey: invitationKeys.pending,
  });
};

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (updatedNotification) => {
      if (updatedNotification) {
        updateNotificationInCache(updatedNotification);
      }
      void queryClient.invalidateQueries({ queryKey: companiesKeys.companies });
      void queryClient.invalidateQueries({ queryKey: invitationKeys.pending });
      void queryClient.invalidateQueries({ queryKey: teamKeys.team });
    },
  });
};

export const useDeclineInvitation = () => {
  return useMutation({
    mutationFn: declineInvitation,
    onSuccess: (updatedNotification) => {
      if (updatedNotification) {
        updateNotificationInCache(updatedNotification);
      }
      void queryClient.invalidateQueries({ queryKey: invitationKeys.pending });
      void queryClient.invalidateQueries({ queryKey: teamKeys.team });
    },
  });
};
