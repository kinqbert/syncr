import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Card,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { Task } from "@syncr/packages";

type TaskCardProps = {
  task: Task;
};

const priorityColorByValue: Record<
  Task["priority"],
  { bgcolor: string; color: string }
> = {
  low: {
    bgcolor: "#d9fbe7",
    color: "#15803d",
  },
  medium: {
    bgcolor: "#fef3c7",
    color: "#b45309",
  },
  high: {
    bgcolor: "#fee2e2",
    color: "#b91c1c",
  },
};

const formatPriority = (priority: Task["priority"]) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
};

export const MIN_TASK_CARD_WIDTH = 280;

export const TaskCard = ({ task }: TaskCardProps) => {
  const priorityColor = priorityColorByValue[task.priority];

  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: MIN_TASK_CARD_WIDTH,
        maxWidth: MIN_TASK_CARD_WIDTH,
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        p: 2,
      }}
    >
      <Stack gap={2}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={1}
        >
          <Typography variant="button">{task.name}</Typography>
          <Tooltip title="Task actions">
            <IconButton
              aria-label="Task actions"
              size="small"
              sx={{ color: "text.secondary", mt: -0.5 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1.5}
        >
          <Stack direction="row" alignItems="center" gap={1.25} minWidth={0}>
            <Avatar
              sx={{
                bgcolor: "#e6e7ff",
                color: "#6d5dfc",
                fontSize: 15,
                fontWeight: 700,
                height: 34,
                width: 34,
              }}
            >
              U{task.assigneeId}
            </Avatar>
            <Typography color="text.secondary" noWrap variant="caption">
              User {task.assigneeId}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" gap={1.5} flexShrink={0}>
            <Chip
              label={formatPriority(task.priority)}
              size="small"
              sx={{
                bgcolor: priorityColor.bgcolor,
                color: priorityColor.color,
                fontWeight: 700,
              }}
            />
            <Stack direction="row" alignItems="center" gap={0.5}>
              <CalendarTodayOutlinedIcon
                sx={{ color: "text.secondary", fontSize: 18 }}
              />
              <Typography color="text.secondary">
                {formatDate(task.endDate)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
