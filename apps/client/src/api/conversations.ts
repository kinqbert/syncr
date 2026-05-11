import type { ConversationHistoryPage, ListConversation } from "@syncr/packages";
import {
  type InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import api from "@/lib/axios";

export const conversationsKeys = {
  all: ["conversations"] as const,
  conversationsList: ["conversations", "list"] as const,
  history: (conversationId: number) =>
    [...conversationsKeys.all, conversationId, "history"] as const,
};

const getConversationsList = async () => {
  const response = await api.get<ListConversation[]>("conversations/list");

  return response.data;
};

const getConversationHistory = async ({
  conversationId,
  limit,
  offset,
}: {
  conversationId: number;
  limit: number;
  offset: number;
}) => {
  const response = await api.get<ConversationHistoryPage>(
    `conversations/${conversationId}/history`,
    {
      params: { limit, offset },
    },
  );

  return response.data;
};

export const useGetConversationsList = () => {
  return useQuery({
    queryFn: getConversationsList,
    queryKey: conversationsKeys.conversationsList,
  });
};

export const useGetConversationHistory = (
  conversationId: number,
  limit = 30,
  enabled = true,
) => {
  return useInfiniteQuery<
    ConversationHistoryPage,
    Error,
    InfiniteData<ConversationHistoryPage>,
    ReturnType<typeof conversationsKeys.history>,
    number
  >({
    enabled,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore
        ? pages.reduce((count, page) => count + page.items.length, 0)
        : undefined,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getConversationHistory({ conversationId, limit, offset: pageParam }),
    queryKey: conversationsKeys.history(conversationId),
  });
};
