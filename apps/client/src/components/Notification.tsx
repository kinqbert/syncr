import { Box, Stack, Typography } from "@mui/material";
import {
  ConversationType,
  type ListConversation,
  type MessagePayload,
  type NotificationPayload,
  NotificationType,
} from "@syncr/packages";
import { Link } from "react-router";

import { ConversationAvatar } from "./conversations/ConversationAvatar";

type NotificationProps = {
  notification: NotificationPayload;
};

type NotificationLinkProps = {
  children: React.ReactNode;
  to?: string;
};

type ConversationMessageNotificationProps = {
  conversation?: ListConversation;
  message: MessagePayload;
  onClick?: () => void;
};

const linkStyle = { color: "blue", textDecoration: "underline" };

const NotificationLink = ({ children, to }: NotificationLinkProps) => {
  if (!to) {
    return children;
  }

  return (
    <Link style={linkStyle} to={to}>
      {children}
    </Link>
  );
};

const getTaskUrl = (notification: NotificationPayload) => {
  const projectId = notification.metadata?.projectId;

  return projectId === undefined
    ? undefined
    : `/projects/${projectId}/tasks/${notification.entityId}`;
};

const getProjectUrl = (notification: NotificationPayload) => {
  const projectId = notification.metadata?.projectId ?? notification.entityId;

  return `/projects/${projectId}/tasks`;
};

const TaskLink = ({ notification }: NotificationProps) => {
  const taskName = notification.metadata?.taskName ?? "Task";

  return (
    <NotificationLink to={getTaskUrl(notification)}>
      {taskName}
    </NotificationLink>
  );
};

const ProjectLink = ({ notification }: NotificationProps) => {
  const projectName = notification.metadata?.projectName ?? "Project";

  return (
    <NotificationLink to={getProjectUrl(notification)}>
      {projectName}
    </NotificationLink>
  );
};

const TaskAssignedNotification = ({ notification }: NotificationProps) => {
  return (
    <Box>
      You have been assigned to <TaskLink notification={notification} />
      {"."}
    </Box>
  );
};

const TaskCommentedNotification = ({ notification }: NotificationProps) => {
  return (
    <Box>
      New comment on <TaskLink notification={notification} />
      {"."}
    </Box>
  );
};

const TaskStatusChangeNotification = ({ notification }: NotificationProps) => {
  return (
    <Box>
      Updated status on <TaskLink notification={notification} />
      {"."}
    </Box>
  );
};

const TaskDeadlineChangedNotification = ({
  notification,
}: NotificationProps) => {
  return (
    <Box>
      Updated deadline on <TaskLink notification={notification} />
      {"."}
    </Box>
  );
};

const TaskAcceptanceCriterionAddedNotification = ({
  notification,
}: NotificationProps) => {
  return (
    <Box>
      New acceptance criterion for <TaskLink notification={notification} />
      {"."}
    </Box>
  );
};

const ProjectAddedNotification = ({ notification }: NotificationProps) => {
  return (
    <Box>
      You have been assigned to new project:{" "}
      <ProjectLink notification={notification} />
      {"."}
    </Box>
  );
};

const CompanyInvitationNotification = ({ notification }: NotificationProps) => {
  const companyName = notification.metadata?.companyName ?? "a company";
  const roleName = notification.metadata?.roleName ?? "team member";

  return (
    <Box>
      You have been invited to join {companyName} as {roleName}.
    </Box>
  );
};

export const ConversationMessageNotification = ({
  conversation,
  message,
  onClick,
}: ConversationMessageNotificationProps) => {
  const senderName = `${message.sender.name} ${message.sender.surname}`;
  const isGroupConversation = conversation?.type === ConversationType.Group;
  const conversationTitle = conversation?.title || "Group";
  const title = isGroupConversation
    ? `${senderName} in ${conversationTitle}`
    : senderName;

  return (
    <Stack
      component={Link}
      onClick={onClick}
      to={`/conversations/${message.conversationId}`}
      alignItems="center"
      direction="row"
      gap={1.25}
      sx={{
        color: "text.primary",
        maxWidth: 430,
        minWidth: 320,
        textDecoration: "none",
      }}
    >
      <ConversationAvatar
        size={30}
        title={isGroupConversation ? conversationTitle : senderName}
        type={conversation?.type ?? ConversationType.Direct}
      />

      <Stack flex={1} gap={0.25} minWidth={0} pt={0.125}>
        <Typography fontSize={14} fontWeight={800} noWrap>
          {title}
        </Typography>

        <Typography
          color="text.primary"
          fontSize={12}
          lineHeight={1.35}
          variant="body2"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            overflowWrap: "anywhere",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {message.content}
        </Typography>
      </Stack>
    </Stack>
  );
};

const NOTIFICATIONS: Record<NotificationType, React.FC<NotificationProps>> = {
  [NotificationType.TaskAssigned]: TaskAssignedNotification,
  [NotificationType.TaskCommented]: TaskCommentedNotification,
  [NotificationType.TaskStatusChanged]: TaskStatusChangeNotification,
  [NotificationType.TaskDeadlineChanged]: TaskDeadlineChangedNotification,
  [NotificationType.TaskAcceptanceCriterionAdded]:
    TaskAcceptanceCriterionAddedNotification,
  [NotificationType.ProjectAdded]: ProjectAddedNotification,
  [NotificationType.CompanyInvitation]: CompanyInvitationNotification,
};

export const Notification = ({ notification }: NotificationProps) => {
  const Content = NOTIFICATIONS[notification.type];

  return (
    <Box>
      <Content notification={notification} />
    </Box>
  );
};
