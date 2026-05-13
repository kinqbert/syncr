import { Stack } from "@mui/material";
import type { ListConversation } from "@syncr/packages";
import { useEffect } from "react";
import { useParams } from "react-router";

import {
  conversationsKeys,
  useGetConversationsList,
  useMarkConversationRead,
} from "@/api/conversations";
import { queryClient } from "@/lib/react-query";
import { useAuthStore } from "@/store/useAuthStore";

import {
  ConversationHeader,
  InvalidConversationState,
  MessageComposer,
  MessageHistory,
} from "./components";
import { useConversationRealtime } from "./hooks/useConversationRealtime";

export const ConversationPage = () => {
  const { conversationId } = useParams();

  const parsedConversationId = Number(conversationId);
  const hasValidConversationId =
    Number.isInteger(parsedConversationId) && parsedConversationId > 0;

  const currentUser = useAuthStore((state) => state.user);

  const { data: conversations = [] } = useGetConversationsList();
  const { mutate: markConversationRead } = useMarkConversationRead();

  const conversation = conversations.find(
    (item) => item.id === parsedConversationId,
  );

  useConversationRealtime({
    conversationId: parsedConversationId,
    enabled: hasValidConversationId,
  });

  useEffect(() => {
    if (!hasValidConversationId) {
      return;
    }

    if (conversation?.unreadCount && conversation?.unreadCount > 0) {
      queryClient.setQueryData<ListConversation[]>(
        conversationsKeys.conversationsList,
        (conversations) =>
          conversations?.map((item) =>
            item.id === parsedConversationId
              ? { ...item, unreadCount: 0 }
              : item,
          ),
      );

      markConversationRead(parsedConversationId);
    }
  }, [
    conversation?.unreadCount,
    hasValidConversationId,
    markConversationRead,
    parsedConversationId,
  ]);

  if (!hasValidConversationId) {
    return <InvalidConversationState />;
  }

  return (
    <Stack
      width="100%"
      height="100%"
      sx={{
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      <ConversationHeader title={conversation?.title} />
      <MessageHistory
        key={parsedConversationId}
        conversationId={parsedConversationId}
        currentUserId={currentUser?.id}
        enabled={hasValidConversationId}
      />
      <MessageComposer conversationId={parsedConversationId} />
    </Stack>
  );
};
