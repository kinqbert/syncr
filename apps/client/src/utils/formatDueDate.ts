import { formatDateShort } from "./formatDate";

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export type DueState = "overdue" | "today" | "soon" | "later" | "none";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Classifies a deadline relative to today for colouring and sorting. */
export const getDueState = (
  value: string | null | undefined,
  now = new Date(),
): DueState => {
  if (!value) {
    return "none";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "none";
  }

  const diffDays = Math.round(
    (startOfDay(date).getTime() - startOfDay(now).getTime()) / DAY_MS,
  );

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 3) return "soon";
  return "later";
};

/** Short human label for a deadline: "Today", "Tomorrow", "Oct 21". */
export const formatDueDate = (
  value: string | null | undefined,
  now = new Date(),
) => {
  if (!value) {
    return "No due date";
  }

  const date = new Date(value);
  const diffDays = Math.round(
    (startOfDay(date).getTime() - startOfDay(now).getTime()) / DAY_MS,
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";

  return formatDateShort(value);
};

export const DUE_STATE_COLOR: Record<DueState, string> = {
  overdue: "error.main",
  today: "warning.main",
  soon: "text.primary",
  later: "text.secondary",
  none: "text.disabled",
};
