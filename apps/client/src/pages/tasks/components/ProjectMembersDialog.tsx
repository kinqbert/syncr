import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type {
  ProjectAssignee,
  ProjectMemberCandidate,
} from "@syncr/packages";
import { useMemo, useState } from "react";

import { getErrorMessage } from "@/utils/getErrorMessage";

type ProjectMembersDialogProps = {
  candidates: ProjectMemberCandidate[];
  isAdding: boolean;
  isCandidatesLoading: boolean;
  isMembersLoading: boolean;
  isOpen: boolean;
  isRemoving: boolean;
  members: ProjectAssignee[];
  onAddMember: (userId: number) => Promise<void>;
  onClose: () => void;
  onRemoveMember: (userId: number) => Promise<void>;
};

const getInitials = (person: Pick<ProjectAssignee, "name" | "surname">) => {
  return `${person.name.at(0) ?? ""}${person.surname.at(0) ?? ""}`.toUpperCase();
};

const getFullName = (person: Pick<ProjectAssignee, "name" | "surname">) => {
  return `${person.name} ${person.surname}`.trim();
};

export const ProjectMembersDialog = ({
  candidates,
  isAdding,
  isCandidatesLoading,
  isMembersLoading,
  isOpen,
  isRemoving,
  members,
  onAddMember,
  onClose,
  onRemoveMember,
}: ProjectMembersDialogProps) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const memberIds = useMemo(
    () => new Set(members.map((member) => member.id)),
    [members],
  );
  const addableCandidates = candidates.filter(
    (candidate) => !memberIds.has(candidate.id),
  );
  const isLoading = isMembersLoading || isCandidatesLoading;

  const handleAddMember = async () => {
    if (!selectedUserId) {
      return;
    }

    setFormError(null);

    try {
      await onAddMember(Number(selectedUserId));
      setSelectedUserId("");
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not add member."));
    }
  };

  const handleRemoveMember = async (userId: number) => {
    setFormError(null);

    try {
      await onRemoveMember(userId);
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not remove member."));
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={isOpen}>
      <DialogTitle>Project members</DialogTitle>
      <DialogContent>
        <Stack gap={2} pt={1}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel id="project-member-label">Add person</InputLabel>
              <Select
                disabled={isLoading || isAdding || addableCandidates.length === 0}
                label="Add person"
                labelId="project-member-label"
                onChange={(event) => setSelectedUserId(event.target.value)}
                value={selectedUserId}
              >
                {addableCandidates.map((candidate) => (
                  <MenuItem key={candidate.id} value={String(candidate.id)}>
                    {getFullName(candidate)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              disabled={!selectedUserId || isAdding}
              onClick={handleAddMember}
              startIcon={<PersonAddAlt1OutlinedIcon />}
              sx={{ minHeight: 40, whiteSpace: "nowrap" }}
              type="button"
              variant="contained"
            >
              Add
            </Button>
          </Box>
          <Divider />
          {members.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No members assigned yet.
            </Typography>
          ) : (
            <List disablePadding>
              {members.map((member) => (
                <ListItem
                  key={member.id}
                  disableGutters
                  secondaryAction={
                    <Tooltip title="Remove member">
                      <span>
                        <IconButton
                          aria-label={`Remove ${getFullName(member)}`}
                          disabled={isAdding || isRemoving}
                          edge="end"
                          onClick={() => void handleRemoveMember(member.id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{getInitials(member)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={getFullName(member)}
                    secondary={member.email}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={isAdding || isRemoving} onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
