import {
  Card,
  Chip,
  IconButton,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { Task, TaskPriority } from "@syncr/packages";
import { Calendar, GripVertical, MoreVertical, UserX } from "lucide-mui";
import { useState } from "react";
import { Link as RouterLink } from "react-router";

import { UserAvatar } from "@/components/UserAvatar";
import { formatDateShort } from "@/utils/formatDate";
import { getUserFullName } from "@/utils/getUserFullName";

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

export const TASK_CARD_WIDTH = 360;

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
          borderColor: "divider",
          borderRadius: 1.5,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          maxWidth: "100%",
          minWidth: 0,
          p: { xs: 1.5, sm: 2 },
          transition: "border-color 160ms ease, box-shadow 160ms ease",
          width: "100%",
        }}
      >
        <Stack gap={2}>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            gap={1}
          >
            <Stack direction="row" alignItems="start" gap={1.25} minWidth={0}>
              <IconButton
                disableRipple
                sx={{
                  flexShrink: 0,
                  mt: 0.25,
                  p: 0,
                  touchAction: "none",
                  width: "34px",
                  cursor: "inherit",
                }}
                {...dragHandleProps}
              >
                <GripVertical />
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
                <MoreVertical fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            gap={1.5}
          >
            <Stack direction="row" alignItems="center" gap={1.25} minWidth={0}>
              <UserAvatar
                fallback={<UserX fontSize="small" />}
                name={task.assignee?.name}
                size={34}
                surname={task.assignee?.surname}
              />
              <Typography color="text.secondary" noWrap variant="body2">
                {assigneeName}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              gap={1.5}
              flexShrink={0}
              justifyContent={{ xs: "space-between", sm: "flex-start" }}
            >
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
                <Calendar
                  sx={{ color: "text.secondary", fontSize: 18 }}
                />
                <Typography color="text.secondary" noWrap>
                  {formatDateShort(task.endDate)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </>
  );
};
