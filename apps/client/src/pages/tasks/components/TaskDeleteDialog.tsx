import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { Task } from "@syncr/packages";

import { useDeleteTask } from "@/api/tasks";
import { useProject } from "@/hooks";

type TaskDeleteDialogProps = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

export const TaskDeleteDialog = ({
  task,
  isOpen,
  onClose,
}: TaskDeleteDialogProps) => {
  const { projectId } = useProject();
  const { mutateAsync } = useDeleteTask();

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Delete task?</DialogTitle>

      <DialogContent>
        <Typography>This action cannot be undone.</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          color="error"
          variant="contained"
          onClick={async () => {
            await mutateAsync({
              taskId: task.id,
              projectId,
            });

            onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
