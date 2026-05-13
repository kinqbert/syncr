import type { ListConversation, MessagePayload } from "@syncr/packages";
import { useEffect } from "react";
import { matchPath, useLocation } from "react-router";

import {
  conversationsKeys,
  useMarkConversationRead,
} from "@/api/conversations";
import { useSocket } from "@/hooks/sockets";
import { queryClient } from "@/lib/react-query";
import { useAuthStore } from "@/store/useAuthStore";

export const ConversationEventsListener = () => {
  const socket = useSocket();
  const location = useLocation();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { mutate: markConversationRead } = useMarkConversationRead();

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
  }, [currentUserId, location.pathname, markConversationRead, socket]);

  return null;
};
