import type { ConversationHistoryPage, MessagePayload } from "@syncr/packages";
import type { InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";

import { conversationsKeys } from "@/api/conversations";
import { useSocket } from "@/hooks/sockets";
import { queryClient } from "@/lib/react-query";

import { mapMessagePayloadToConversationMessage } from "../utils/conversationMessages";

type UseConversationRealtimeParams = {
  conversationId: number;
  enabled: boolean;
};

export const useConversationRealtime = ({
  conversationId,
  enabled,
}: UseConversationRealtimeParams) => {
  const socket = useSocket();

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

    const handleMessageCreated = (payload: MessagePayload) => {
      if (payload.conversationId !== conversationId) {
        return;
      }

      const message = mapMessagePayloadToConversationMessage(payload);

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
  }, [conversationId, enabled, socket]);
};
