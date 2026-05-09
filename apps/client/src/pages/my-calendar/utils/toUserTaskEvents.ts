import type { EventInput } from "@fullcalendar/core";
import type { AssignedTask } from "@syncr/packages";

import { getPriorityEventClassName, toCalendarDate } from "@/utils/calendar";

export const toUserTaskEvents = (tasks: AssignedTask[]): EventInput[] => {
  return tasks.reduce<EventInput[]>((events, task) => {
    if (!task.endDate) {
      return events;
    }

    const start = toCalendarDate(task.endDate);

    if (!start) {
      return events;
    }

    events.push({
      allDay: true,
      classNames: [getPriorityEventClassName(task.priority)],
      extendedProps: {
        meta: task.project.name,
      },
      id: String(task.id),
      start,
      title: task.name,
      url: `/projects/${task.projectId}/tasks/${task.id}`,
    });

    return events;
  }, []);
};
