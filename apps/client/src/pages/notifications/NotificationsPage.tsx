import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
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
import { type NotificationPayload, NotificationType } from "@syncr/packages";
import { useMemo, useState } from "react";

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
    default:
      return "Notification";
  }
};

const getNotificationIcon = (notification: NotificationPayload) => {
  switch (notification.type) {
    case NotificationType.TaskAssigned:
      return <AssignmentTurnedInOutlinedIcon fontSize="small" />;
    case NotificationType.TaskCommented:
      return <ChatBubbleOutlineIcon fontSize="small" />;
    case NotificationType.TaskStatusChanged:
      return <CheckCircleOutlineIcon fontSize="small" />;
    case NotificationType.TaskDeadlineChanged:
      return <EventOutlinedIcon fontSize="small" />;
    case NotificationType.TaskAcceptanceCriterionAdded:
      return <RuleOutlinedIcon fontSize="small" />;
    case NotificationType.ProjectAdded:
      return <GroupAddOutlinedIcon fontSize="small" />;
    default:
      return <CheckCircleOutlineIcon fontSize="small" />;
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
    default:
      return { bgcolor: "action.hover", color: "text.secondary" };
  }
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
    <Box component="main" sx={{ minWidth: 0, p: 3, width: "100%" }}>
      <Stack
        alignItems={{ xs: "flex-start", sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        gap={2}
        justifyContent="space-between"
        mb={4}
      >
        <Box>
          <Typography fontWeight={700} variant="h5">
            Notifications
          </Typography>
          <Typography color="text.secondary" mt={0.75}>
            You have {unreadCount} unread notification
            {unreadCount === 1 ? "" : "s"}
          </Typography>
        </Box>
        <Button
          disabled={unreadCount === 0 || markAllNotificationsRead.isPending}
          onClick={() => markAllNotificationsRead.mutate()}
          sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
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
          sx={{ minHeight: 50, px: 2 }}
          value={filter}
        >
          {FILTERS.map((item) => (
            <Tab
              key={item.value}
              label={item.label}
              sx={{ minHeight: 50, textTransform: "none" }}
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
                  alignItems="center"
                  direction="row"
                  gap={2}
                  sx={{
                    bgcolor: notification.isRead
                      ? "background.paper"
                      : "grey.50",
                    minHeight: 108,
                    px: 2.75,
                    py: 2.5,
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
                      height: 36,
                      justifyContent: "center",
                      width: 36,
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
                    <Stack alignItems="center" direction="row" gap={2} mt={1}>
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
