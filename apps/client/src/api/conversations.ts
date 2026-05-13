import type {
  ConversationHistoryPage,
  CreateDirectConversationBody,
  CreateGroupConversationBody,
  ListConversation,
  MessageResponse,
  SendMessageBody,
} from "@syncr/packages";
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import api from "@/lib/axios";
import { queryClient } from "@/lib/react-query";

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

const createDirectConversation = async (body: CreateDirectConversationBody) => {
  const response = await api.post<ListConversation>(
    "conversations/direct",
    body,
  );

  return response.data;
};

const createGroupConversation = async (body: CreateGroupConversationBody) => {
  const response = await api.post<ListConversation>(
    "conversations/group",
    body,
  );

  return response.data;
};

const sendConversationMessage = async ({
  conversationId,
  body,
}: {
  conversationId: number;
  body: SendMessageBody;
}) => {
  const response = await api.post<MessageResponse>(
    `conversations/${conversationId}/message`,
    body,
  );

  return response.data;
};

const markConversationRead = async (conversationId: number) => {
  await api.patch(`conversations/${conversationId}/read`);
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

export const useCreateDirectConversation = () => {
  return useMutation({
    mutationFn: createDirectConversation,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: conversationsKeys.conversationsList,
      });
    },
  });
};

export const useCreateGroupConversation = () => {
  return useMutation({
    mutationFn: createGroupConversation,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: conversationsKeys.conversationsList,
      });
    },
  });
};

export const useSendConversationMessage = () => {
  return useMutation({
    mutationFn: sendConversationMessage,
    onSuccess: (_message, variables) => {
      void queryClient.invalidateQueries({
        queryKey: conversationsKeys.history(variables.conversationId),
      });
      void queryClient.invalidateQueries({
        queryKey: conversationsKeys.conversationsList,
      });
    },
  });
};

export const useMarkConversationRead = () => {
  return useMutation({
    mutationFn: markConversationRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: conversationsKeys.conversationsList,
      });
    },
  });
};
