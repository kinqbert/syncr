import { useDroppable } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type {
  CreateTaskBody,
  ProjectAssignee,
  TaskStatus,
} from "@syncr/packages";
import { useState } from "react";

import { TASK_CARD_WIDTH } from "./TaskCard";
import { TaskCreateForm } from "./TaskCreateForm";

export type KanbanColumn = { status: TaskStatus; label: string };

type KanbanColumnProps = {
  children: React.ReactNode;
  column: KanbanColumn;
  isCreating?: boolean;
  isDragOver?: boolean;
  onCreateTask: (body: CreateTaskBody) => Promise<void>;
  projectAssignees: ProjectAssignee[];
};

const PADDING = 8;

export const KanbanColumn = ({
  children,
  column,
  isCreating = false,
  isDragOver = false,
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
        minWidth: TASK_CARD_WIDTH + PADDING * 2,
        maxWidth: TASK_CARD_WIDTH + PADDING * 2,
        width: "100%",
        borderRadius: 2,
        transition: "background-color 160ms ease",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={`${PADDING}px`}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {column.label}
        </Typography>
        <Tooltip title={isFormOpen ? "Close form" : "Create task"}>
          <IconButton
            aria-label={isFormOpen ? "Close task form" : "Create task"}
            disabled={isCreating}
            onClick={isFormOpen ? handleCloseForm : handleOpenForm}
          >
            {isFormOpen ? <CloseIcon /> : <AddIcon />}
          </IconButton>
        </Tooltip>
      </Stack>

      {isFormOpen && (
        <TaskCreateForm
          isCreating={isCreating}
          onClose={handleCloseForm}
          onCreateTask={onCreateTask}
          projectAssignees={projectAssignees}
          status={column.status}
        />
      )}

      <Box
        minHeight="600px"
        sx={{
          p: `${PADDING}px`,
          backgroundColor: isDragOver ? "kanban.bgActive" : "kanban.bg",
          borderRadius: 2,
          boxSizing: "border-box",
          transition: "border-color 160ms ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
