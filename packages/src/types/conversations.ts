export const ConversationType = {
  Direct: "direct",
  Group: "group",
} as const;

export type ConversationType =
  (typeof ConversationType)[keyof typeof ConversationType];

export type ListConversation = {
  id: number;
  type: ConversationType;
  title: string;
  lastMessage?: {
    authorName: string;
    content: string;
  };
};

export type ConversationMessageAuthor = {
  id: number;
  name: string;
  surname: string;
};

export type ConversationMessage = {
  id: number;
  conversationId: number;
  author: ConversationMessageAuthor | null;
  content: string;
  createdAt: string;
  editedAt: string | null;
};

export type ConversationHistoryPage = {
  items: ConversationMessage[];
  hasMore: boolean;
};

export type CreateDirectConversationBody = {
  targetUserId: number;
};

export type CreateGroupConversationBody = {
  title: string;
  targetUserIds: number[];
};
