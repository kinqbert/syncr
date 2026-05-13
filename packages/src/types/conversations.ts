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
  unreadCount: number;
};

export type ConversationMessageAuthor = {
  id: number;
  name: string;
  surname: string;
};

export type ConversationMessageReply = {
  id: number;
  author: ConversationMessageAuthor | null;
  content: string;
  createdAt: string;
};

export type ConversationMessage = {
  id: number;
  conversationId: number;
  author: ConversationMessageAuthor | null;
  replyTo: ConversationMessageReply | null;
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

export type SendMessageBody = {
  content: string;
  replyToMessageId?: number | null;
};

export type MessagePayload = {
  id: number;
  content: string;
  conversationId: number;
  createdAt: string;
  replyTo: ConversationMessageReply | null;
  sender: {
    id: number;
    name: string;
    surname: string;
  };
};

export type MessageResponse = MessagePayload;

export type StartTypingPayload = {
  conversationId: number;
  userId: number;
};

export type StopTypingPayload = StartTypingPayload;
