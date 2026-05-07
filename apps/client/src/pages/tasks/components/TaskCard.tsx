import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
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
import type { Task, TaskPriority } from "@syncr/packages";
import { useState } from "react";
import { Link as RouterLink } from "react-router";

import { formatDateShort } from "@/utils/formatDate";
import { getUserFullName } from "@/utils/getUserFullName";
import { getUserInitials } from "@/utils/getUserInitials";

import { TaskCardMenu } from "./TaskCardMenu";

type TaskCardProps = {
  task: Task;
  detailsPath?: string;
  onMenuOpenChange?: (open: boolean) => void;
  dragHandleProps?: Record<string, unknown>;
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

const formatPriority = (priority: TaskPriority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

export const TASK_CARD_WIDTH = 320;

export const TaskCard = ({
  detailsPath,
  task,
  onMenuOpenChange,
  dragHandleProps,
}: TaskCardProps) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    setMenuAnchor(event.currentTarget);

    onMenuOpenChange?.(true);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);

    onMenuOpenChange?.(false);
  };

  const isMenuOpen = Boolean(menuAnchor);
  const priorityColor = priorityColorByValue[task.priority];
  const assigneeName = task.assignee
    ? getUserFullName(task.assignee.name, task.assignee.surname)
    : "Unassigned";

  return (
    <>
      <TaskCardMenu
        task={task}
        menuAnchor={menuAnchor}
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
      />
      <Card
        variant="outlined"
        sx={{
          minWidth: TASK_CARD_WIDTH,
          maxWidth: TASK_CARD_WIDTH,
          borderColor: "divider",
          borderRadius: 1.5,
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
            <Stack direction="row" alignItems="start" gap={1.25}>
              <IconButton
                disableRipple
                sx={{ width: "34px", p: 0, mt: 0.25, cursor: "inherit" }}
                {...dragHandleProps}
              >
                <DragIndicatorIcon />
              </IconButton>
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
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap",
                    "&:hover": {
                      color: "primary.main",
                    },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: 2,
                    },
                  }}
                  variant="subtitle1"
                >
                  {task.name}
                </MuiLink>
              ) : (
                <Typography variant="subtitle1">{task.name}</Typography>
              )}
            </Stack>
            <Tooltip title="Task actions">
              <IconButton
                aria-label="Task actions"
                size="small"
                sx={{ color: "text.secondary", mt: -0.5 }}
                onClick={handleMenuOpen}
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
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
                {task.assignee ? (
                  getUserInitials(task.assignee.name, task.assignee.surname)
                ) : (
                  <PersonOffOutlinedIcon fontSize="small" />
                )}
              </Avatar>
              <Typography color="text.secondary" noWrap variant="body2">
                {assigneeName}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1.5} flexShrink={0}>
              <Chip
                label={formatPriority(task.priority)}
                size="small"
                sx={{
                  borderRadius: 1.5,
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
                  {formatDateShort(task.endDate)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card>{" "}
    </>
  );
};
