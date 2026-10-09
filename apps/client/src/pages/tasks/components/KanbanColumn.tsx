import { useDroppable } from "@dnd-kit/core";
import { Box, Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type {
  CreateTaskBody,
  ProjectAssignee,
  TaskStatus,
} from "@syncr/packages";
import { Plus } from "lucide-mui";
import { useState } from "react";

import { StatusIcon } from "@/components/ui";

import { TASK_CARD_WIDTH } from "./TaskCard";
import { TaskCreateForm } from "./TaskCreateForm";

export type KanbanColumn = { status: TaskStatus; label: string };

type KanbanColumnProps = {
  children: React.ReactNode;
  column: KanbanColumn;
  count: number;
  isCreating?: boolean;
  isDragOver?: boolean;
  isLoading?: boolean;
  onCreateTask: (body: CreateTaskBody) => Promise<void>;
  projectAssignees: ProjectAssignee[];
};

const COLUMN_PADDING = 6;
const COLUMN_WIDTH = TASK_CARD_WIDTH + COLUMN_PADDING * 2;

export const KanbanColumn = ({
  children,
  column,
  count,
  isCreating = false,
  isDragOver = false,
  isLoading = false,
  onCreateTask,
  projectAssignees,
}: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id: column.status });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCloseForm = () => {
    if (isCreating) {
      return;
    }

    setIsFormOpen(false);
  };

  return (
    <Stack
      sx={{
        flex: "0 0 auto",
        height: "100%",
        minHeight: 0,
        width: { xs: `min(84vw, ${COLUMN_WIDTH}px)`, sm: COLUMN_WIDTH },
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        gap={1}
        sx={{ height: 36, px: 1 }}
      >
        <StatusIcon status={column.status} />
        <Typography fontWeight={600} noWrap>
          {column.label}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {count}
        </Typography>
        <Tooltip title="Add task">
          <IconButton
            aria-label={`Add task to ${column.label}`}
            disabled={isCreating || isLoading}
            onClick={() => setIsFormOpen(true)}
            size="small"
            sx={{ ml: "auto" }}
          >
            <Plus />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        ref={setNodeRef}
        sx={{
          bgcolor: isDragOver ? "accent.soft" : "surface.subtle",
          borderRadius: 2,
          flex: 1,
          minHeight: 120,
          outline: isDragOver ? "1px dashed" : "none",
          outlineColor: "primary.main",
          overflowY: "auto",
          p: `${COLUMN_PADDING}px`,
          transition: "background-color 120ms ease",
        }}
      >
        {children}

        {isFormOpen ? (
          <Box sx={{ mt: 0.75 }}>
            <TaskCreateForm
              isCreating={isCreating}
              onClose={handleCloseForm}
              onCreateTask={onCreateTask}
              projectAssignees={projectAssignees}
              status={column.status}
            />
          </Box>
        ) : (
          <Button
            color="inherit"
            disabled={isCreating || isLoading}
            fullWidth
            onClick={() => setIsFormOpen(true)}
            size="small"
            startIcon={<Plus />}
            sx={{
              color: "text.secondary",
              justifyContent: "flex-start",
              mt: count > 0 ? 0.75 : 0,
            }}
          >
            Add task
          </Button>
        )}
      </Box>
    </Stack>
  );
};
