import { Stack } from "@mui/material";
import { useParams } from "react-router";

import { useGetConversationsList } from "@/api/conversations";
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
  const conversation = conversations.find(
    (item) => item.id === parsedConversationId,
  );

  useConversationRealtime({
    conversationId: parsedConversationId,
    enabled: hasValidConversationId,
  });

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
