import { Box } from "@mui/material";
import { type NotificationPayload, NotificationType } from "@syncr/packages";
import { Link } from "react-router";

type NotificationProps = {
  notification: NotificationPayload;
};

type NotificationLinkProps = {
  children: React.ReactNode;
  to?: string;
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
    <NotificationLink to={getTaskUrl(notification)}>{taskName}</NotificationLink>
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
