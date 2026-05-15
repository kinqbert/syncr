import { Stack } from "@mui/material";
import type { ConversationMessage, ListConversation } from "@syncr/packages";
import { ConversationType } from "@syncr/packages";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import {
  conversationsKeys,
  useGetConversationsList,
  useMarkConversationRead,
} from "@/api/conversations";
import { useGetTeamMembers } from "@/api/team";
import { queryClient } from "@/lib/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { getUserFullName } from "@/utils/getUserFullName";

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
  const [replyToMessageState, setReplyToMessageState] = useState<{
    conversationId: number;
    message: ConversationMessage;
  } | null>(null);

  const { data: conversations = [] } = useGetConversationsList();
  const { data: teamMembers = [] } = useGetTeamMembers();
  const { mutate: markConversationRead } = useMarkConversationRead();

  const conversation = conversations.find(
    (item) => item.id === parsedConversationId,
  );
  const replyToMessage =
    replyToMessageState?.conversationId === parsedConversationId
      ? replyToMessageState.message
      : null;

  const { typingUserIds } = useConversationRealtime({
    conversationId: parsedConversationId,
    currentUserId: currentUser?.id,
    enabled: hasValidConversationId,
  });
  const typingUsers = typingUserIds.map((userId) => {
    const member = teamMembers.find((member) => member.id === userId);
    const fallbackName =
      conversation?.type === ConversationType.Direct && conversation.title
        ? conversation.title
        : "Someone";

    return {
      id: userId,
      name: member
        ? getUserFullName(member.name, member.surname) || member.email
        : fallbackName,
    };
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
        onReply={(message) =>
          setReplyToMessageState({
            conversationId: parsedConversationId,
            message,
          })
        }
      />
      <MessageComposer
        conversationId={parsedConversationId}
        onCancelReply={() => setReplyToMessageState(null)}
        replyTo={replyToMessage}
        typingUsers={typingUsers}
      />
    </Stack>
  );
};
