import { Alert, Box, Button } from "@mui/material";
import type { ProjectActivity } from "@syncr/packages";
import { Activity } from "lucide-mui";

import { useGetProjectActivities } from "@/api/projects";
import { EmptyState, ListRow, RowSkeleton, Section } from "@/components/ui";
import { UserAvatar } from "@/components/UserAvatar";
import { TASK_ACTIVITY_LABEL } from "@/constants/taskActivityLabels";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getTaskDisplayName } from "@/utils/getTaskDisplayName";
import { getUserFullName } from "@/utils/getUserFullName";

type ActivityTimelineProps = {
  projectId: number;
  projectName?: string;
};

const ACTIVITY_PAGE_SIZE = 5;

const getActivityActorName = (activity: ProjectActivity) => {
  return activity.actor
    ? getUserFullName(activity.actor.name, activity.actor.surname)
    : "Deleted user";
};

export const ActivityTimeline = ({
  projectId,
  projectName,
}: ActivityTimelineProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    error,
    isError,
    isFetchingNextPage,
    isPending: isLoading,
  } = useGetProjectActivities(projectId, ACTIVITY_PAGE_SIZE);
  const activities = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Section icon={<Activity />} padding="none" title="Activity">
      <Box sx={{ p: 1 }}>
        {isLoading ? <RowSkeleton count={4} /> : null}

        {isError ? (
          <Alert severity="error">
            {getErrorMessage(error, "Could not load project activity.")}
          </Alert>
        ) : null}

        {!isLoading && !isError && activities.length === 0 ? (
          <EmptyState compact title="No activity yet" />
        ) : null}

        {!isError &&
          activities.map((item) => (
            <ListRow
              key={item.id}
              leading={
                <UserAvatar
                  name={item.actor?.name}
                  size={22}
                  surname={item.actor?.surname}
                />
              }
              title={
                <>
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    {getActivityActorName(item)}
                  </Box>{" "}
                  <Box component="span" sx={{ color: "text.secondary" }}>
                    {TASK_ACTIVITY_LABEL[item.action]}
                  </Box>{" "}
                  {getTaskDisplayName(item.task.name, projectName)}
                </>
              }
              to={`/projects/${projectId}/tasks/${item.task.id}`}
              trailing={formatRelativeDate(item.createdAt)}
            />
          ))}

        {!isError && hasNextPage ? (
          <Button
            color="inherit"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
            size="small"
            sx={{ color: "text.secondary", ml: 0.5, mt: 0.5 }}
          >
            {isFetchingNextPage ? "Loading…" : "Show more"}
          </Button>
        ) : null}
      </Box>
    </Section>
  );
};
