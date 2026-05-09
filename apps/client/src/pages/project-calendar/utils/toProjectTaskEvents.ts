import type { EventInput } from "@fullcalendar/core";
import type { Task } from "@syncr/packages";

import { getPriorityEventClassName, toCalendarDate } from "@/utils/calendar";

export const toProjectTaskEvents = (tasks: Task[]): EventInput[] => {
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
        meta: task.assignee
          ? `${task.assignee.name} ${task.assignee.surname}`
          : "Unassigned",
      },
      id: String(task.id),
      start,
      title: task.name,
      url: `/projects/${task.projectId}/tasks/${task.id}`,
    });

    return events;
  }, []);
};
