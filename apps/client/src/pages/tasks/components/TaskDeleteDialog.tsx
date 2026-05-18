import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { Task } from "@syncr/packages";
import { toast } from "sonner";

import { useDeleteTask } from "@/api/tasks";
import { useProject } from "@/hooks";
import { getErrorMessage } from "@/utils/getErrorMessage";

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
            try {
              await mutateAsync({
                taskId: task.id,
                projectId,
              });

              onClose();
            } catch (error) {
              toast.error(getErrorMessage(error, "Could not delete task."));
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
