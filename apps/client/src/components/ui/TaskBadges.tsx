import { Box, Stack, type SxProps, type Theme, Typography } from "@mui/material";
import {
  TASK_PRIORITY_LABEL,
  TASK_STATUS_LABEL,
  type TaskPriority,
  type TaskStatus,
} from "@syncr/packages";

const PRIORITY_LEVEL: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/** Linear-style signal bars: filled bars show the priority level. */
export const PriorityIcon = ({
  priority,
  size = 14,
}: {
  priority: TaskPriority;
  size?: number;
}) => {
  const level = PRIORITY_LEVEL[priority];
  const barWidth = Math.max(2, Math.round(size / 5));

  return (
    <Stack
      alignItems="flex-end"
      aria-hidden
      direction="row"
      gap={`${Math.max(1, Math.round(size / 10))}px`}
      sx={{ height: size, width: size, justifyContent: "center", py: "1px" }}
    >
      {[1, 2, 3].map((bar) => (
        <Box
          key={bar}
          sx={{
            bgcolor: bar <= level ? `priority.${priority}` : "line.strong",
            borderRadius: "1px",
            height: `${30 + bar * 23}%`,
            width: barWidth,
          }}
        />
      ))}
    </Stack>
  );
};

/** Circle that fills up as a task moves through the workflow. */
export const StatusIcon = ({
  size = 14,
  status,
}: {
  size?: number;
  status: TaskStatus;
}) => {
  const color = `status.${status}`;
  const fill: Record<TaskStatus, number> = {
    backlog: 0,
    todo: 0,
    in_progress: 50,
    review: 75,
    done: 100,
  };
  const percent = fill[status];

  return (
    <Box
      aria-hidden
      sx={{
        border: "1.5px solid",
        borderColor: color,
        borderRadius: "50%",
        borderStyle: status === "backlog" ? "dashed" : "solid",
        flexShrink: 0,
        height: size,
        position: "relative",
        width: size,
        "&::after": {
          background: (theme) => {
            const c = theme.vars.palette.status[status];
            return `conic-gradient(${c} ${percent}%, transparent 0)`;
          },
          borderRadius: "50%",
          content: '""',
          inset: 2,
          position: "absolute",
        },
      }}
    />
  );
};

type BadgeProps = {
  showLabel?: boolean;
  sx?: SxProps<Theme>;
};

export const StatusBadge = ({
  showLabel = true,
  status,
  sx,
}: BadgeProps & { status: TaskStatus }) => (
  <Stack
    alignItems="center"
    direction="row"
    gap={0.75}
    sx={[{ minWidth: 0 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    title={TASK_STATUS_LABEL[status]}
  >
    <StatusIcon status={status} />
    {showLabel && (
      <Typography noWrap variant="body2">
        {TASK_STATUS_LABEL[status]}
      </Typography>
    )}
  </Stack>
);

export const PriorityBadge = ({
  priority,
  showLabel = true,
  sx,
}: BadgeProps & { priority: TaskPriority }) => (
  <Stack
    alignItems="center"
    direction="row"
    gap={0.75}
    sx={[{ minWidth: 0 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    title={`${TASK_PRIORITY_LABEL[priority]} priority`}
  >
    <PriorityIcon priority={priority} />
    {showLabel && (
      <Typography noWrap variant="body2">
        {TASK_PRIORITY_LABEL[priority]}
      </Typography>
    )}
  </Stack>
);
