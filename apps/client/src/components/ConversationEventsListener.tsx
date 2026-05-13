import type { ListConversation, MessagePayload } from "@syncr/packages";
import { useCallback, useEffect, useRef } from "react";
import { matchPath, useLocation } from "react-router";
import { toast } from "sonner";

import {
  conversationsKeys,
  useMarkConversationRead,
} from "@/api/conversations";
import { useSocket } from "@/hooks/sockets";
import { queryClient } from "@/lib/react-query";
import { useAuthStore } from "@/store/useAuthStore";

import { ConversationMessageNotification } from "./Notification";

export const ConversationEventsListener = () => {
  const socket = useSocket();
  const location = useLocation();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { mutate: markConversationRead } = useMarkConversationRead();
  const conversationToastIdsRef = useRef(new Map<number, Set<string>>());

  const dismissConversationNotifications = useCallback(
    (conversationId: number) => {
      const toastIds = conversationToastIdsRef.current.get(conversationId);

      if (!toastIds) {
        return;
      }

      toastIds.forEach((toastId) => toast.dismiss(toastId));
      conversationToastIdsRef.current.delete(conversationId);
    },
    [],
  );

  useEffect(() => {
    const activeConversationMatch = matchPath(
      "/conversations/:conversationId",
      location.pathname,
    );
    const activeConversationId = Number(
      activeConversationMatch?.params.conversationId,
    );

    if (Number.isInteger(activeConversationId) && activeConversationId > 0) {
      dismissConversationNotifications(activeConversationId);
    }
  }, [dismissConversationNotifications, location.pathname]);

  useEffect(() => {
    const handleMessageCreated = (payload: MessagePayload) => {
      const activeConversationMatch = matchPath(
        "/conversations/:conversationId",
        location.pathname,
      );

      const activeConversationId = Number(
        activeConversationMatch?.params.conversationId,
      );

      const isActiveConversation =
        activeConversationId === payload.conversationId;

      const isOwnMessage = payload.sender.id === currentUserId;
      const conversations =
        queryClient.getQueryData<ListConversation[]>(
          conversationsKeys.conversationsList,
        ) ?? [];
      const conversation = conversations.find(
        (item) => item.id === payload.conversationId,
      );

      if (!isOwnMessage && !isActiveConversation) {
        const toastId = `conversation-${payload.conversationId}:message-${payload.id}`;
        const toastIds =
          conversationToastIdsRef.current.get(payload.conversationId) ??
          new Set<string>();

        toastIds.add(toastId);
        conversationToastIdsRef.current.set(payload.conversationId, toastIds);

        toast(
          <ConversationMessageNotification
            conversation={conversation}
            message={payload}
            onClick={() =>
              dismissConversationNotifications(payload.conversationId)
            }
          />,
          {
            id: toastId,
            closeButton: true,
            duration: 100000,
          },
        );
      }

      queryClient.setQueryData<ListConversation[]>(
        conversationsKeys.conversationsList,
        (conversations) => {
          if (!conversations) {
            return conversations;
          }

          const nextConversations = conversations.map((conversation) => {
            if (conversation.id !== payload.conversationId) {
              return conversation;
            }

            return {
              ...conversation,
              unreadCount:
                isOwnMessage || isActiveConversation
                  ? 0
                  : conversation.unreadCount + 1,
            };
          });

          return nextConversations.sort((a, b) => {
            if (a.id === payload.conversationId) return -1;
            if (b.id === payload.conversationId) return 1;
            return 0;
          });
        },
      );

      if (isActiveConversation && !isOwnMessage) {
        markConversationRead(payload.conversationId);
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: conversationsKeys.conversationsList,
      });
    };

    socket.on("message.created", handleMessageCreated);

    return () => {
      socket.off("message.created", handleMessageCreated);
    };
  }, [
    currentUserId,
    dismissConversationNotifications,
    location.pathname,
    markConversationRead,
    socket,
  ]);

  return null;
};
