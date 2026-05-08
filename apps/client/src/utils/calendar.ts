import type { Task } from "@syncr/packages";

export const getPriorityEventClassName = (priority: Task["priority"]) => {
  return `syncr-calendar-event-priority-${priority}`;
};

export const toCalendarDate = (value: string) => {
  const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

  if (dateOnly) {
    return dateOnly;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
