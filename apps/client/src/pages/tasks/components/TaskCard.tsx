import {
  Box,
  Card,
  IconButton,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { type Task, TASK_PRIORITY_LABEL } from "@syncr/packages";
import { GripVertical, MoreHorizontal } from "lucide-mui";
import { useState } from "react";
import { Link as RouterLink } from "react-router";

import { PriorityIcon } from "@/components/ui";
import { UserAvatar } from "@/components/UserAvatar";
import {
  DUE_STATE_COLOR,
  formatDueDate,
  getDueState,
} from "@/utils/formatDueDate";
import { getTaskDisplayName } from "@/utils/getTaskDisplayName";
import { getUserFullName } from "@/utils/getUserFullName";

import { TaskCardMenu } from "./TaskCardMenu";

type TaskCardProps = {
  task: Task;
  detailsPath?: string;
  projectName?: string | null;
  onMenuOpenChange?: (open: boolean) => void;
  /** Only passed on touch devices, where the grip is the drag handle. */
  dragHandleProps?: Record<string, unknown>;
  isOverlay?: boolean;
};

const MAX_VISIBLE_LABELS = 2;

export const TASK_CARD_WIDTH = 280;

const stopPointer = (event: React.PointerEvent) => {
  event.stopPropagation();
};

export const TaskCard = ({
  detailsPath,
  dragHandleProps,
  isOverlay = false,
  onMenuOpenChange,
  projectName,
  task,
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
  const title = getTaskDisplayName(task.name, projectName);
  const dueState = task.status === "done" ? "none" : getDueState(task.endDate);
  const assigneeName = task.assignee
    ? getUserFullName(task.assignee.name, task.assignee.surname)
    : "Unassigned";
  const extraLabels = task.labels.length - MAX_VISIBLE_LABELS;

  return (
    <>
      <TaskCardMenu
        task={task}
        menuAnchor={menuAnchor}
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
      />
      <Card
        sx={{
          bgcolor: "background.paper",
          borderColor: isOverlay ? "line.strong" : "divider",
          borderRadius: 1.5,
          boxShadow: isOverlay
            ? "var(--mui-palette-elevation-popover)"
            : "var(--mui-palette-elevation-card)",
          minWidth: 0,
          px: 1.5,
          py: 1.25,
          transition: "border-color 120ms ease",
          width: "100%",
          "&:hover": { borderColor: "line.strong" },
          "&:hover .task-card-actions, &:focus-within .task-card-actions": {
            opacity: 1,
          },
        }}
      >
        <Stack gap={1}>
          <Stack alignItems="flex-start" direction="row" gap={0.5}>
            {dragHandleProps && (
              <Box
                aria-label="Drag task"
                component="span"
                {...dragHandleProps}
                sx={{
                  color: "text.disabled",
                  display: "inline-flex",
                  ml: -0.75,
                  mt: "1px",
                  touchAction: "none",
                  "& .MuiSvgIcon-root": { fontSize: 16 },
                }}
              >
                <GripVertical />
              </Box>
            )}
            {detailsPath ? (
              <MuiLink
                component={RouterLink}
                to={detailsPath}
                underline="none"
                sx={{
                  color: "text.primary",
                  flex: 1,
                  fontWeight: 500,
                  minWidth: 0,
                  overflowWrap: "anywhere",
                  "&:hover": { textDecoration: "underline" },
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 2,
                  },
                }}
              >
                {title}
              </MuiLink>
            ) : (
              <Typography flex={1} fontWeight={500}>
                {title}
              </Typography>
            )}
            <IconButton
              aria-label="Task actions"
              className="task-card-actions"
              onClick={handleMenuOpen}
              onPointerDown={stopPointer}
              size="small"
              sx={{
                mr: -0.75,
                mt: -0.5,
                opacity: { xs: 1, md: isMenuOpen ? 1 : 0 },
                transition: "opacity 120ms ease",
              }}
            >
              <MoreHorizontal />
            </IconButton>
          </Stack>

          <Stack alignItems="center" direction="row" gap={1} minWidth={0}>
            <Tooltip title={`${TASK_PRIORITY_LABEL[task.priority]} priority`}>
              <Box sx={{ display: "inline-flex" }}>
                <PriorityIcon priority={task.priority} />
              </Box>
            </Tooltip>

            {task.endDate && (
              <Typography
                noWrap
                variant="body2"
                sx={{ color: DUE_STATE_COLOR[dueState], flexShrink: 0 }}
              >
                {formatDueDate(task.endDate)}
              </Typography>
            )}

            <Stack direction="row" flex={1} gap={0.5} minWidth={0} overflow="hidden">
              {task.labels.slice(0, MAX_VISIBLE_LABELS).map((label) => (
                <Typography
                  component="span"
                  key={label.id}
                  noWrap
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 999,
                    color: "text.secondary",
                    fontSize: 11,
                    lineHeight: "16px",
                    minWidth: 0,
                    px: 0.75,
                  }}
                >
                  {label.name}
                </Typography>
              ))}
              {extraLabels > 0 && (
                <Typography color="text.secondary" fontSize={11} lineHeight="18px">
                  +{extraLabels}
                </Typography>
              )}
            </Stack>

            <Tooltip title={assigneeName}>
              <Box sx={{ display: "inline-flex", flexShrink: 0 }}>
                <UserAvatar
                  fallback=""
                  name={task.assignee?.name}
                  size={20}
                  surname={task.assignee?.surname}
                  sx={
                    task.assignee
                      ? undefined
                      : {
                          bgcolor: "transparent",
                          border: "1px dashed",
                          borderColor: "line.strong",
                        }
                  }
                />
              </Box>
            </Tooltip>
          </Stack>
        </Stack>
      </Card>
    </>
  );
};
