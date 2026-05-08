import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import type { Task } from "@syncr/packages";
import { Trash2 } from "lucide-mui";
import { useState } from "react";

import { TaskDeleteDialog } from "./TaskDeleteDialog";

type TaskCardMenuProps = {
  task: Task;
  menuAnchor: HTMLElement | null;
  isMenuOpen: boolean;
  handleMenuClose: () => void;
};

export const TaskCardMenu = ({
  task,
  menuAnchor,
  isMenuOpen,
  handleMenuClose,
}: TaskCardMenuProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteDialogClose = async () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setIsDeleteDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <Trash2 color="error" fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Delete task"
            slotProps={{
              primary: {
                color: "error",
              },
            }}
          />
        </MenuItem>
      </Menu>
      <TaskDeleteDialog
        task={task}
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
      />
    </>
  );
};
