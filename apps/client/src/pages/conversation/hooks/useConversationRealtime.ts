import type {
  ConversationHistoryPage,
  MessagePayload,
  StartTypingPayload,
  StopTypingPayload,
} from "@syncr/packages";
import type { InfiniteData } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { conversationsKeys } from "@/api/conversations";
import { useSocket } from "@/hooks/sockets";
import { queryClient } from "@/lib/react-query";

import { mapMessagePayloadToConversationMessage } from "../utils/conversationMessages";

type UseConversationRealtimeParams = {
  conversationId: number;
  currentUserId?: number;
  enabled: boolean;
};

export const useConversationRealtime = ({
  conversationId,
  currentUserId,
  enabled,
}: UseConversationRealtimeParams) => {
  const socket = useSocket();
  const [typingUserIds, setTypingUserIds] = useState<number[]>([]);
  const typingTimersRef = useRef(new Map<number, number>());

  const clearTypingTimer = useCallback((userId: number) => {
    const timerId = typingTimersRef.current.get(userId);

    if (timerId != null) {
      window.clearTimeout(timerId);
      typingTimersRef.current.delete(userId);
    }
  }, []);

  const removeTypingUser = useCallback(
    (userId: number) => {
      clearTypingTimer(userId);
      setTypingUserIds((currentUserIds) =>
        currentUserIds.filter((currentUserId) => currentUserId !== userId),
      );
    },
    [clearTypingTimer],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const joinConversation = () => {
      socket.emit("conversation.join", { conversationId });
    };

    joinConversation();
    socket.on("connect", joinConversation);

    return () => {
      socket.off("connect", joinConversation);
      socket.emit("conversation.leave", { conversationId });
    };
  }, [conversationId, enabled, socket]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const typingTimers = typingTimersRef.current;

    const handleTypingStarted = (payload: StartTypingPayload) => {
      if (
        payload.conversationId !== conversationId ||
        payload.userId === currentUserId
      ) {
        return;
      }

      clearTypingTimer(payload.userId);
      setTypingUserIds((currentUserIds) =>
        currentUserIds.includes(payload.userId)
          ? currentUserIds
          : [...currentUserIds, payload.userId],
      );

      const timerId = window.setTimeout(() => {
        removeTypingUser(payload.userId);
      }, 4000);

      typingTimers.set(payload.userId, timerId);
    };

    const handleTypingStopped = (payload: StopTypingPayload) => {
      if (payload.conversationId !== conversationId) {
        return;
      }

      removeTypingUser(payload.userId);
    };

    socket.on("typing.started", handleTypingStarted);
    socket.on("typing.stopped", handleTypingStopped);

    return () => {
      socket.off("typing.started", handleTypingStarted);
      socket.off("typing.stopped", handleTypingStopped);
      typingTimers.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      typingTimers.clear();
      setTypingUserIds([]);
    };
  }, [
    clearTypingTimer,
    conversationId,
    currentUserId,
    enabled,
    removeTypingUser,
    socket,
  ]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMessageCreated = (payload: MessagePayload) => {
      if (payload.conversationId !== conversationId) {
        return;
      }

      const message = mapMessagePayloadToConversationMessage(payload);

      removeTypingUser(payload.sender.id);

      queryClient.setQueryData<InfiniteData<ConversationHistoryPage>>(
        conversationsKeys.history(conversationId),
        (history) => {
          if (
            history?.pages.some((page) =>
              page.items.some((item) => item.id === message.id),
            )
          ) {
            return history;
          }

          if (!history) {
            return {
              pageParams: [0],
              pages: [{ hasMore: false, items: [message] }],
            };
          }

          return {
            ...history,
            pages: history.pages.map((page, index) =>
              index === 0 ? { ...page, items: [message, ...page.items] } : page,
            ),
          };
        },
      );
    };

    socket.on("message.created", handleMessageCreated);

    return () => {
      socket.off("message.created", handleMessageCreated);
    };
  }, [conversationId, enabled, removeTypingUser, socket]);

  return {
    typingUserIds,
  };
};
