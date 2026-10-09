import {
  Box,
  Button,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  InvitationStatus,
  type NotificationPayload,
  NotificationType,
} from "@syncr/packages";
import {
  CalendarClock,
  Check,
  CheckCheck,
  CircleCheck,
  ClipboardCheck,
  FolderPlus,
  Inbox,
  ListChecks,
  MessageCircle,
  UserPlus,
} from "lucide-mui";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useAcceptInvitation, useDeclineInvitation } from "@/api/invitations";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationAsRead,
} from "@/api/notifications";
import { ErrorState } from "@/components/ErrorState";
import { Notification } from "@/components/Notification";
import {
  EmptyState,
  Page,
  PageHeader,
  RowSkeleton,
  Section,
} from "@/components/ui";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { getErrorMessage } from "@/utils/getErrorMessage";

type NotificationFilter = "all" | "unread" | "tasks" | "comments" | "deadlines";

const FILTERS: { label: string; value: NotificationFilter }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Tasks", value: "tasks" },
  { label: "Comments", value: "comments" },
  { label: "Deadlines", value: "deadlines" },
];

const TASK_NOTIFICATION_TYPES = new Set<NotificationType>([
  NotificationType.TaskAssigned,
  NotificationType.TaskStatusChanged,
  NotificationType.TaskAcceptanceCriterionAdded,
]);

const getNotificationTitle = (notification: NotificationPayload) => {
  switch (notification.type) {
    case NotificationType.TaskAssigned:
      return "Task Assigned";
    case NotificationType.TaskCommented:
      return "New Comment";
    case NotificationType.TaskStatusChanged:
      return "Task Status Updated";
    case NotificationType.TaskDeadlineChanged:
      return "Deadline Updated";
    case NotificationType.TaskAcceptanceCriterionAdded:
      return "Acceptance Criterion Added";
    case NotificationType.ProjectAdded:
      return "Team Update";
    case NotificationType.CompanyInvitation:
      return "Company Invitation";
    default:
      return "Notification";
  }
};

const getNotificationIcon = (notification: NotificationPayload) => {
  switch (notification.type) {
    case NotificationType.TaskAssigned:
      return <ClipboardCheck />;
    case NotificationType.TaskCommented:
      return <MessageCircle />;
    case NotificationType.TaskStatusChanged:
      return <CircleCheck />;
    case NotificationType.TaskDeadlineChanged:
      return <CalendarClock />;
    case NotificationType.TaskAcceptanceCriterionAdded:
      return <ListChecks />;
    case NotificationType.ProjectAdded:
      return <FolderPlus />;
    case NotificationType.CompanyInvitation:
      return <UserPlus />;
    default:
      return <CircleCheck />;
  }
};

const getIconColors = (notification: NotificationPayload) => {
  switch (notification.type) {
    case NotificationType.TaskAssigned:
    case NotificationType.TaskStatusChanged:
      return { bgcolor: "tint.green.bg", color: "tint.green.fg" };
    case NotificationType.TaskCommented:
      return { bgcolor: "tint.blue.bg", color: "tint.blue.fg" };
    case NotificationType.TaskDeadlineChanged:
      return { bgcolor: "tint.orange.bg", color: "tint.orange.fg" };
    case NotificationType.TaskAcceptanceCriterionAdded:
      return { bgcolor: "tint.violet.bg", color: "tint.violet.fg" };
    case NotificationType.ProjectAdded:
      return { bgcolor: "tint.indigo.bg", color: "tint.indigo.fg" };
    case NotificationType.CompanyInvitation:
      return { bgcolor: "tint.green.bg", color: "tint.green.fg" };
    default:
      return { bgcolor: "action.hover", color: "text.secondary" };
  }
};

const isActiveInvitationNotification = (notification: NotificationPayload) => {
  return (
    notification.type === NotificationType.CompanyInvitation &&
    Boolean(notification.metadata?.invitationId) &&
    notification.metadata?.invitationStatus === InvitationStatus.Active
  );
};

const getInvitationId = (notification: NotificationPayload) => {
  return notification.metadata?.invitationId;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const getDayLabel = (value: string) => {
  const date = new Date(value);
  const today = new Date();
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOf(today) - startOf(date)) / DAY_MS);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This week";
  return "Earlier";
};

/** Groups notifications (already newest first) under relative day labels. */
const groupByDay = (notifications: NotificationPayload[]) =>
  notifications.reduce<{ label: string; items: NotificationPayload[] }[]>(
    (groups, notification) => {
      const label = getDayLabel(notification.createdAt);
      const last = groups[groups.length - 1];

      if (last?.label === label) {
        last.items.push(notification);
      } else {
        groups.push({ label, items: [notification] });
      }

      return groups;
    },
    [],
  );

const matchesFilter = (
  notification: NotificationPayload,
  filter: NotificationFilter,
) => {
  switch (filter) {
    case "unread":
      return !notification.isRead;
    case "tasks":
      return TASK_NOTIFICATION_TYPES.has(notification.type);
    case "comments":
      return notification.type === NotificationType.TaskCommented;
    case "deadlines":
      return notification.type === NotificationType.TaskDeadlineChanged;
    case "all":
    default:
      return true;
  }
};

export const NotificationsPage = () => {
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const {
    data: notifications = [],
    error,
    isError,
    isPending,
  } = useGetNotifications();
  const markNotificationAsRead = useMarkNotificationAsRead();
  const markAllNotificationsRead = useMarkAllNotificationsRead();
  const acceptInvitation = useAcceptInvitation();
  const declineInvitation = useDeclineInvitation();

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;
  const filteredNotifications = useMemo(
    () =>
      notifications.filter((notification) =>
        matchesFilter(notification, filter),
      ),
    [filter, notifications],
  );

  const handleMarkAllRead = () => {
    markAllNotificationsRead.mutate(undefined, {
      onError: (error) => {
        toast.error(getErrorMessage(error, "Could not mark notifications read."));
      },
    });
  };

  const handleMarkRead = (notificationId: number) => {
    markNotificationAsRead.mutate(notificationId, {
      onError: (error) => {
        toast.error(getErrorMessage(error, "Could not mark notification read."));
      },
    });
  };

  const handleAcceptInvitation = (invitationId: number) => {
    acceptInvitation.mutate(invitationId, {
      onError: (error) => {
        toast.error(getErrorMessage(error, "Could not accept invitation."));
      },
    });
  };

  const handleDeclineInvitation = (invitationId: number) => {
    declineInvitation.mutate(invitationId, {
      onError: (error) => {
        toast.error(getErrorMessage(error, "Could not decline invitation."));
      },
    });
  };

  if (isError) {
    return (
      <ErrorState
        error={error}
        fallback="Could not load notifications."
        title="Could not load notifications."
      />
    );
  }

  const groups = groupByDay(filteredNotifications);

  return (
    <Page maxWidth={960}>
      <PageHeader
        actions={
          <Button
            disabled={unreadCount === 0 || markAllNotificationsRead.isPending}
            onClick={handleMarkAllRead}
            size="small"
            startIcon={<CheckCheck />}
            variant="outlined"
          >
            Mark all as read
          </Button>
        }
        tabs={
          <Tabs
            onChange={(_, value: NotificationFilter) => setFilter(value)}
            value={filter}
            variant="scrollable"
          >
            {FILTERS.map((item) => {
              const count = notifications.filter((notification) =>
                matchesFilter(notification, item.value),
              ).length;

              return (
                <Tab
                  key={item.value}
                  label={
                    <Stack direction="row" gap={0.75}>
                      {item.label}
                      {count > 0 && (
                        <Box component="span" sx={{ color: "text.disabled" }}>
                          {count}
                        </Box>
                      )}
                    </Stack>
                  }
                  value={item.value}
                />
              );
            })}
          </Tabs>
        }
        title="Notifications"
      />

      {isPending ? (
        <RowSkeleton count={6} />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          description={
            filter === "unread"
              ? "You've read everything. Nice."
              : "Updates about your tasks and projects will land here."
          }
          icon={<Inbox />}
          title={filter === "unread" ? "All caught up" : "Nothing here yet"}
        />
      ) : (
        <Stack gap={2.5}>
          {groups.map((group) => (
            <Stack gap={0.5} key={group.label}>
              <Typography color="text.secondary" sx={{ px: 1 }} variant="overline">
                {group.label}
              </Typography>
              <Section padding="none">
                {group.items.map((notification, index) => {
                  const iconColors = getIconColors(notification);

                  return (
                    <Stack
                      alignItems="flex-start"
                      direction="row"
                      gap={1.5}
                      key={notification.id}
                      sx={{
                        borderTop: index === 0 ? 0 : 1,
                        borderColor: "line.subtle",
                        px: 2,
                        py: 1.5,
                        "&:hover .notification-actions, &:focus-within .notification-actions":
                          { opacity: 1 },
                      }}
                    >
                      <Box
                        sx={{
                          alignItems: "center",
                          bgcolor: iconColors.bgcolor,
                          borderRadius: 1.5,
                          color: iconColors.color,
                          display: "flex",
                          flex: "0 0 auto",
                          height: 28,
                          justifyContent: "center",
                          mt: 0.25,
                          width: 28,
                          "& .MuiSvgIcon-root": { fontSize: 15 },
                        }}
                      >
                        {getNotificationIcon(notification)}
                      </Box>

                      <Box minWidth={0} sx={{ flex: 1 }}>
                        <Stack alignItems="baseline" direction="row" gap={1}>
                          <Typography
                            fontWeight={notification.isRead ? 500 : 600}
                            noWrap
                            sx={{ flex: 1, minWidth: 0 }}
                          >
                            {getNotificationTitle(notification)}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            flexShrink={0}
                            variant="body2"
                          >
                            {formatRelativeDate(notification.createdAt)}
                          </Typography>
                        </Stack>
                        <Box sx={{ color: "text.secondary", mt: 0.25 }}>
                          <Notification notification={notification} />
                        </Box>
                        {isActiveInvitationNotification(notification) && (
                          <Stack direction="row" gap={1} mt={1.25}>
                            <Button
                              disabled={acceptInvitation.isPending}
                              onClick={() => {
                                const invitationId = getInvitationId(notification);

                                if (invitationId) {
                                  handleAcceptInvitation(invitationId);
                                }
                              }}
                              size="small"
                              variant="contained"
                            >
                              Accept
                            </Button>
                            <Button
                              disabled={declineInvitation.isPending}
                              onClick={() => {
                                const invitationId = getInvitationId(notification);

                                if (invitationId) {
                                  handleDeclineInvitation(invitationId);
                                }
                              }}
                              size="small"
                              variant="outlined"
                            >
                              Decline
                            </Button>
                          </Stack>
                        )}
                      </Box>

                      <Stack
                        alignItems="center"
                        direction="row"
                        flexShrink={0}
                        gap={0.5}
                        justifyContent="flex-end"
                        sx={{ minHeight: 24, width: 52 }}
                      >
                        {!notification.isRead && (
                          <>
                            <Tooltip title="Mark as read">
                              <IconButton
                                aria-label="Mark as read"
                                className="notification-actions"
                                disabled={markNotificationAsRead.isPending}
                                onClick={() => handleMarkRead(notification.id)}
                                size="small"
                                sx={{ opacity: { xs: 1, md: 0 } }}
                              >
                                <Check />
                              </IconButton>
                            </Tooltip>
                            <Box
                              aria-label="Unread"
                              sx={{
                                bgcolor: "primary.main",
                                borderRadius: "50%",
                                height: 7,
                                width: 7,
                              }}
                            />
                          </>
                        )}
                      </Stack>
                    </Stack>
                  );
                })}
              </Section>
            </Stack>
          ))}
        </Stack>
      )}
    </Page>
  );
};
