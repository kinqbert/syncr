import { useDroppable } from "@dnd-kit/core";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type {
  CreateTaskBody,
  ProjectAssignee,
  TaskStatus,
} from "@syncr/packages";
import { Plus, X } from "lucide-mui";
import { useState } from "react";

import { TASK_CARD_WIDTH } from "./TaskCard";
import { TaskCreateForm } from "./TaskCreateForm";

export type KanbanColumn = { status: TaskStatus; label: string };

type KanbanColumnProps = {
  children: React.ReactNode;
  column: KanbanColumn;
  isCreating?: boolean;
  isDragOver?: boolean;
  isLoading?: boolean;
  onCreateTask: (body: CreateTaskBody) => Promise<void>;
  projectAssignees: ProjectAssignee[];
};

const PADDING = 8;

export const KanbanColumn = ({
  children,
  column,
  isCreating = false,
  isDragOver = false,
  isLoading = false,
  onCreateTask,
  projectAssignees,
}: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id: column.status });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (isCreating) {
      return;
    }

    setIsFormOpen(false);
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{
        borderRadius: 2,
        flex: "0 0 auto",
        maxWidth: {
          xs: `calc(min(82vw, ${TASK_CARD_WIDTH}px) + ${PADDING * 2}px)`,
          sm: TASK_CARD_WIDTH + PADDING * 2,
        },
        minWidth: {
          xs: `calc(min(82vw, ${TASK_CARD_WIDTH}px) + ${PADDING * 2}px)`,
          sm: TASK_CARD_WIDTH + PADDING * 2,
        },
        position: "relative",
        transition: "background-color 160ms ease",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={`${PADDING}px`}
      >
        <Typography noWrap variant="subtitle1" fontWeight={600}>
          {column.label}
        </Typography>
        <Tooltip title={isFormOpen ? "Close form" : "Create task"}>
          <IconButton
            aria-label={isFormOpen ? "Close task form" : "Create task"}
            disabled={isCreating || isLoading}
            onClick={isFormOpen ? handleCloseForm : handleOpenForm}
          >
            {isFormOpen ? <X /> : <Plus />}
          </IconButton>
        </Tooltip>
      </Stack>

      {isFormOpen && (
        <Box
          sx={{
            left: 0,
            position: "absolute",
            right: 0,
            top: 40,
            zIndex: 2,
          }}
        >
          <TaskCreateForm
            isCreating={isCreating}
            onClose={handleCloseForm}
            onCreateTask={onCreateTask}
            projectAssignees={projectAssignees}
            status={column.status}
          />
        </Box>
      )}

      <Box
        sx={{
          p: `${PADDING}px`,
          backgroundColor: isDragOver ? "kanban.bgActive" : "kanban.bg",
          borderRadius: 2,
          boxSizing: "border-box",
          minHeight: { xs: 480, sm: 560, lg: 600 },
          transition: "border-color 160ms ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
