import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import {
  Avatar,
  Card,
  Chip,
  IconButton,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { Task } from "@syncr/packages";
import { Link as RouterLink } from "react-router";

import { formatDate } from "@/utils/formatDate";
import { formatDuration } from "@/utils/formatDuration";
import { getUserFullName } from "@/utils/getUserFullName";
import { getUserInitials } from "@/utils/getUserInitials";

type TaskCardProps = {
  detailsPath?: string;
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

export const TASK_CARD_WIDTH = 320;

export const TaskCard = ({ detailsPath, task }: TaskCardProps) => {
  const priorityColor = priorityColorByValue[task.priority];
  const assigneeName = task.assignee
    ? getUserFullName(task.assignee.name, task.assignee.surname)
    : "Unassigned";

  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: TASK_CARD_WIDTH,
        maxWidth: TASK_CARD_WIDTH,
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        p: 2,
        transition: "border-color 160ms ease, box-shadow 160ms ease",
      }}
    >
      <Stack gap={2}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={1}
        >
          {detailsPath ? (
            <MuiLink
              component={RouterLink}
              to={detailsPath}
              underline="none"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              sx={{
                borderRadius: 1,
                color: "inherit",
                cursor: "pointer",
                minWidth: 0,
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                },
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: 2,
                },
              }}
              variant="button"
            >
              {task.name}
            </MuiLink>
          ) : (
            <Typography variant="button">{task.name}</Typography>
          )}
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
          direction="column"
          alignItems="start"
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
              {task.assignee ? (
                getUserInitials(task.assignee.name, task.assignee.surname)
              ) : (
                <PersonOffOutlinedIcon fontSize="small" />
              )}
            </Avatar>
            <Typography color="text.secondary" noWrap variant="caption">
              {assigneeName}
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
              <AccessTimeOutlinedIcon
                sx={{ color: "text.secondary", fontSize: 18 }}
              />
              <Typography color="text.secondary">
                {formatDuration(task.estimateMinutes)}
              </Typography>
            </Stack>
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
