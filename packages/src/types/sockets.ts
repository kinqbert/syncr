import {
  type StartTypingPayload,
  type StopTypingPayload,
  type MessagePayload,
} from "./conversations";
import { type NotificationPayload } from "./notifications";
import { type TaskChangedPayload } from "./tasks";

export type ServerToClientEvents = {
  notification: (payload: NotificationPayload) => void;

  "message.created": (payload: MessagePayload) => void;

  "typing.started": (payload: StartTypingPayload) => void;

  "typing.stopped": (payload: StopTypingPayload) => void;

  "task.changed": (payload: TaskChangedPayload) => void;
};

export type ClientToServerEvents = {
  "company.select": (payload: { companyId: number }) => void;

  "conversation.join": (payload: { conversationId: number }) => void;

  "conversation.leave": (payload: { conversationId: number }) => void;

  "typing.started": (payload: { conversationId: number }) => void;

  "typing.stopped": (payload: { conversationId: number }) => void;
};
