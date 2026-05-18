import { Paper, Stack, Typography } from "@mui/material";
import type { DashboardActivity } from "@syncr/packages";

import { UserAvatar } from "@/components/UserAvatar";
import { TASK_ACTIVITY_LABEL } from "@/constants/taskActivityLabels";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { getUserFullName } from "@/utils/getUserFullName";

type RecentActivityProps = {
  activities: DashboardActivity[];
};

const getActivityActorName = (activity: DashboardActivity) => {
  return activity.actor
    ? getUserFullName(activity.actor.name, activity.actor.surname)
    : "Deleted user";
};

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack gap={2.5}>
        <Typography fontSize={18} fontWeight={800}>
          Recent Activity
        </Typography>

        {activities.length === 0 ? (
          <Typography color="text.secondary">No recent activity yet.</Typography>
        ) : null}

        {activities.map((activity) => (
          <Stack
            key={activity.id}
            alignItems="flex-start"
            direction="row"
            gap={1.5}
            minWidth={0}
          >
            <UserAvatar
              name={activity.actor?.name}
              size={34}
              surname={activity.actor?.surname}
            />
            <Stack minWidth={0}>
              <Typography fontSize={14}>
                <Typography component="span" fontSize="inherit" fontWeight={650}>
                  {getActivityActorName(activity)}
                </Typography>{" "}
                {TASK_ACTIVITY_LABEL[activity.action]} {activity.task.name}
              </Typography>
              <Typography color="text.secondary" fontSize={12}>
                {formatRelativeDate(activity.createdAt)}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};
