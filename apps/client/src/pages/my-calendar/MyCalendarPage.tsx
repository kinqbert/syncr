import { useGetMyAssignedTasks } from "@/api/tasks";
import { TaskDeadlineCalendar } from "@/components/calendar";
import { ErrorState } from "@/components/ErrorState";
import { Page, PageHeader } from "@/components/ui";

import { toUserTaskEvents } from "./utils/toUserTaskEvents";

export const MyCalendarPage = () => {
  const {
    data: tasks = [],
    error,
    isError,
    isLoading,
  } = useGetMyAssignedTasks();
  const events = toUserTaskEvents(tasks);

  if (isError) {
    return (
      <ErrorState
        error={error}
        fallback="Could not load calendar tasks."
        title="Could not load calendar."
      />
    );
  }

  return (
    <Page sx={{ height: "100%" }}>
      <PageHeader
        description="Tasks assigned to you across all projects, on their due date."
        title="My calendar"
      />
      <TaskDeadlineCalendar events={events} isLoading={isLoading} />
    </Page>
  );
};
