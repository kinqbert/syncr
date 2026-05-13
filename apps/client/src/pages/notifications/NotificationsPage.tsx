import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  InvitationStatus,
  type NotificationPayload,
  NotificationType,
} from "@syncr/packages";
import {
  CalendarClock,
  CircleCheck,
  ClipboardCheck,
  FolderPlus,
  ListChecks,
  MessageCircle,
  UserPlus,
} from "lucide-mui";
import { useMemo, useState } from "react";

import { useAcceptInvitation, useDeclineInvitation } from "@/api/invitations";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationAsRead,
} from "@/api/notifications";
import { Notification } from "@/components/Notification";
import { formatRelativeDate } from "@/utils/formatRelativeDate";

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
      return <ClipboardCheck fontSize="small" />;
    case NotificationType.TaskCommented:
      return <MessageCircle fontSize="small" />;
    case NotificationType.TaskStatusChanged:
      return <CircleCheck fontSize="small" />;
    case NotificationType.TaskDeadlineChanged:
      return <CalendarClock fontSize="small" />;
    case NotificationType.TaskAcceptanceCriterionAdded:
      return <ListChecks fontSize="small" />;
    case NotificationType.ProjectAdded:
      return <FolderPlus fontSize="small" />;
    case NotificationType.CompanyInvitation:
      return <UserPlus fontSize="small" />;
    default:
      return <CircleCheck fontSize="small" />;
  }
};

const getIconColors = (notification: NotificationPayload) => {
  switch (notification.type) {
    case NotificationType.TaskAssigned:
    case NotificationType.TaskStatusChanged:
      return { bgcolor: "#DCFCE7", color: "#16A34A" };
    case NotificationType.TaskCommented:
      return { bgcolor: "#DBEAFE", color: "#2563EB" };
    case NotificationType.TaskDeadlineChanged:
      return { bgcolor: "#FFEDD5", color: "#EA580C" };
    case NotificationType.TaskAcceptanceCriterionAdded:
      return { bgcolor: "#F3E8FF", color: "#9333EA" };
    case NotificationType.ProjectAdded:
      return { bgcolor: "#E0E7FF", color: "#4F46E5" };
    case NotificationType.CompanyInvitation:
      return { bgcolor: "#ECFDF5", color: "#059669" };
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
  const { data: notifications = [], isPending } = useGetNotifications();
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

  return (
    <Box
      component="main"
      sx={{ minWidth: 0, p: { xs: 2, sm: 3 }, width: "100%" }}
    >
      <Stack
        alignItems={{ xs: "stretch", lg: "center" }}
        direction={{ xs: "column", lg: "row" }}
        gap={2}
        justifyContent="space-between"
        mb={{ xs: 2.5, sm: 3 }}
      >
        <Stack gap={0.5} minWidth={0}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: 28, sm: 34 }, lineHeight: 1.2 }}
          >
            Notifications
          </Typography>
          <Typography color="text.secondary">
            You have {unreadCount} unread notification
            {unreadCount === 1 ? "" : "s"}
          </Typography>
        </Stack>
        <Button
          disabled={unreadCount === 0 || markAllNotificationsRead.isPending}
          onClick={() => markAllNotificationsRead.mutate()}
          sx={{ alignSelf: { xs: "stretch", sm: "flex-start", lg: "center" } }}
        >
          Mark all as read
        </Button>
      </Stack>

      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Tabs
          onChange={(_, value: NotificationFilter) => setFilter(value)}
          sx={{
            minHeight: { xs: 44, sm: 50 },
            px: { xs: 1, sm: 2 },
            "& .MuiTabs-flexContainer": {
              gap: { xs: 0.5, sm: 0 },
            },
          }}
          value={filter}
          variant="scrollable"
        >
          {FILTERS.map((item) => (
            <Tab
              key={item.value}
              label={item.label}
              sx={{
                fontSize: { xs: 13, sm: 14 },
                minHeight: { xs: 44, sm: 50 },
                minWidth: { xs: "auto", sm: 90 },
                px: { xs: 1.25, sm: 2 },
                textTransform: "none",
              }}
              value={item.value}
            />
          ))}
        </Tabs>
        <Divider />

        {isPending ? (
          <Stack alignItems="center" py={8}>
            <CircularProgress />
          </Stack>
        ) : filteredNotifications.length === 0 ? (
          <Stack alignItems="center" py={8}>
            <Typography color="text.secondary">No notifications</Typography>
          </Stack>
        ) : (
          filteredNotifications.map((notification, index) => {
            const iconColors = getIconColors(notification);

            return (
              <Box key={notification.id}>
                <Stack
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  direction="row"
                  gap={{ xs: 1.5, sm: 2 }}
                  sx={{
                    bgcolor: notification.isRead
                      ? "background.paper"
                      : "grey.50",
                    minHeight: { xs: "auto", sm: 108 },
                    px: { xs: 2, sm: 2.75 },
                    py: { xs: 2, sm: 2.5 },
                  }}
                >
                  <Box
                    sx={{
                      alignItems: "center",
                      bgcolor: iconColors.bgcolor,
                      borderRadius: "50%",
                      color: iconColors.color,
                      display: "flex",
                      flex: "0 0 auto",
                      height: { xs: 34, sm: 36 },
                      justifyContent: "center",
                      width: { xs: 34, sm: 36 },
                    }}
                  >
                    {getNotificationIcon(notification)}
                  </Box>

                  <Box minWidth={0} sx={{ flex: 1 }}>
                    <Typography fontWeight={600}>
                      {getNotificationTitle(notification)}
                    </Typography>
                    <Typography color="text.secondary" mt={0.5}>
                      <Notification notification={notification} />
                    </Typography>
                    <Stack
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      direction={{ xs: "column", sm: "row" }}
                      gap={{ xs: 0.75, sm: 2 }}
                      mt={1}
                    >
                      <Typography color="text.secondary" variant="caption">
                        {formatRelativeDate(notification.createdAt)}
                      </Typography>
                      {!notification.isRead && (
                        <Button
                          disabled={markNotificationAsRead.isPending}
                          onClick={() =>
                            markNotificationAsRead.mutate(notification.id)
                          }
                          size="small"
                          sx={{ minWidth: 0, p: 0, textTransform: "none" }}
                        >
                          Mark as read
                        </Button>
                      )}
                    </Stack>
                    {isActiveInvitationNotification(notification) && (
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        gap={1}
                        mt={1.5}
                      >
                        <Button
                          disabled={acceptInvitation.isPending}
                          onClick={() => {
                            const invitationId = getInvitationId(notification);

                            if (invitationId) {
                              acceptInvitation.mutate(invitationId);
                            }
                          }}
                          size="small"
                          sx={{ width: { xs: "100%", sm: "auto" } }}
                          variant="contained"
                        >
                          Accept
                        </Button>
                        <Button
                          color="inherit"
                          disabled={declineInvitation.isPending}
                          onClick={() => {
                            const invitationId = getInvitationId(notification);

                            if (invitationId) {
                              declineInvitation.mutate(invitationId);
                            }
                          }}
                          size="small"
                          sx={{ width: { xs: "100%", sm: "auto" } }}
                          variant="outlined"
                        >
                          Decline
                        </Button>
                      </Stack>
                    )}
                  </Box>

                  {!notification.isRead && (
                    <Box
                      sx={{
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                        flex: "0 0 auto",
                        height: 8,
                        width: 8,
                      }}
                    />
                  )}
                </Stack>
                {index < filteredNotifications.length - 1 && <Divider />}
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};
