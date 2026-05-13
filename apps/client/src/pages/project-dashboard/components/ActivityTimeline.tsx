import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { ProjectActivity } from "@syncr/packages";
import { ListChecks } from "lucide-mui";

import { useGetProjectActivities } from "@/api/projects";
import { UserAvatar } from "@/components/UserAvatar";
import { TASK_ACTIVITY_LABEL } from "@/constants/taskActivityLabels";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { getUserFullName } from "@/utils/getUserFullName";

type ActivityTimelineProps = {
  projectId: number;
};

const ACTIVITY_PAGE_SIZE = 5;

const getActivityActorName = (activity: ProjectActivity) => {
  return activity.actor
    ? getUserFullName(activity.actor.name, activity.actor.surname)
    : "Deleted user";
};

const getActivityText = (activity: ProjectActivity) => {
  return `${getActivityActorName(activity)} ${TASK_ACTIVITY_LABEL[activity.action]} "${activity.task.name}"`;
};

export const ActivityTimeline = ({ projectId }: ActivityTimelineProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isLoading,
  } = useGetProjectActivities(projectId, ACTIVITY_PAGE_SIZE);
  const activities = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Stack gap={2.25} minWidth={0}>
        <Stack alignItems="center" direction="row" gap={1}>
          <ListChecks sx={{ color: "primary.main", fontSize: 19 }} />
          <Typography fontSize={17} fontWeight={800}>
            Activity Timeline
          </Typography>
        </Stack>

        {isLoading ? (
          <Stack alignItems="center" py={1}>
            <CircularProgress size={24} />
          </Stack>
        ) : null}

        {!isLoading && activities.length === 0 ? (
          <Typography color="text.secondary" fontSize={14}>
            No activity yet.
          </Typography>
        ) : null}

        {activities.map((item) => (
          <Stack
            key={item.id}
            alignItems="center"
            direction="row"
            gap={1.5}
            minWidth={0}
          >
            <UserAvatar
              name={item.actor?.name}
              size={32}
              surname={item.actor?.surname}
            />
            <Stack minWidth={0}>
              <Typography noWrap fontSize={14}>
                {getActivityText(item)}
              </Typography>
              <Typography color="text.secondary" fontSize={12}>
                {formatRelativeDate(item.createdAt)}
              </Typography>
            </Stack>
          </Stack>
        ))}

        {hasNextPage ? (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
            size="small"
            sx={{ alignSelf: "flex-start" }}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
};
