import { Box, Stack } from "@mui/material";
import type { DashboardActivity } from "@syncr/packages";
import { Activity } from "lucide-mui";

import { EmptyState, ListRow, Section } from "@/components/ui";
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
    <Section icon={<Activity />} padding="none" title="Recent activity">
      {activities.length === 0 ? (
        <EmptyState compact title="No recent activity yet" />
      ) : (
        <Stack sx={{ maxHeight: 360, overflowY: "auto", p: 1 }}>
          {activities.map((activity) => (
            <ListRow
              key={activity.id}
              leading={
                <UserAvatar
                  name={activity.actor?.name}
                  size={22}
                  surname={activity.actor?.surname}
                />
              }
              subtitle={formatRelativeDate(activity.createdAt)}
              title={
                <>
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    {getActivityActorName(activity)}
                  </Box>{" "}
                  <Box component="span" sx={{ color: "text.secondary" }}>
                    {TASK_ACTIVITY_LABEL[activity.action]}
                  </Box>{" "}
                  {activity.task.name}
                </>
              }
              wrap
            />
          ))}
        </Stack>
      )}
    </Section>
  );
};
