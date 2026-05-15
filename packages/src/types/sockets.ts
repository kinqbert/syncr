import {
  type StartTypingPayload,
  type StopTypingPayload,
  type MessagePayload,
} from "./conversations";
import { type NotificationPayload } from "./notifications";

export type ServerToClientEvents = {
  notification: (payload: NotificationPayload) => void;

  "message.created": (payload: MessagePayload) => void;

  "typing.started": (payload: StartTypingPayload) => void;

  "typing.stopped": (payload: StopTypingPayload) => void;
};

export type ClientToServerEvents = {
  "conversation.join": (payload: { conversationId: number }) => void;

  "conversation.leave": (payload: { conversationId: number }) => void;

  "typing.started": (payload: { conversationId: number }) => void;

  "typing.stopped": (payload: { conversationId: number }) => void;
};
