import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ProjectAssignee, ProjectMemberCandidate } from "@syncr/packages";
import { Trash2, UserPlus } from "lucide-mui";
import { useMemo, useState } from "react";

import { UserAvatar } from "@/components/UserAvatar";
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
  const [selectedCandidates, setSelectedCandidates] = useState<
    ProjectMemberCandidate[]
  >([]);
  const [formError, setFormError] = useState<string | null>(null);
  const memberIds = useMemo(
    () => new Set(members.map((member) => member.id)),
    [members],
  );
  const addableCandidates = candidates.filter(
    (candidate) => !memberIds.has(candidate.id),
  );
  const isLoading = isMembersLoading || isCandidatesLoading;

  const handleAddMembers = async () => {
    if (selectedCandidates.length === 0) {
      return;
    }

    setFormError(null);

    try {
      for (const candidate of selectedCandidates) {
        await onAddMember(candidate.id);
      }

      setSelectedCandidates([]);
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not add members."));
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
              alignItems: "end",
            }}
          >
            <Autocomplete<ProjectMemberCandidate, true, false, false>
              disabled={isLoading || isAdding || addableCandidates.length === 0}
              filterSelectedOptions
              getOptionLabel={getFullName}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              multiple
              onChange={(_, value) => setSelectedCandidates(value)}
              options={addableCandidates}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add people"
                  placeholder={
                    selectedCandidates.length === 0 ? "Select people" : ""
                  }
                  size="small"
                />
              )}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;

                return (
                  <Box component="li" key={key} {...optionProps}>
                    <Stack minWidth={0}>
                      <Typography noWrap>{getFullName(option)}</Typography>
                      <Typography color="text.secondary" noWrap variant="body2">
                        {option.email}
                      </Typography>
                    </Stack>
                  </Box>
                );
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });

                  return (
                    <Chip
                      key={key}
                      label={getFullName(option)}
                      size="small"
                      {...tagProps}
                    />
                  );
                })
              }
              size="small"
              value={selectedCandidates}
            />
            <Button
              disabled={selectedCandidates.length === 0 || isAdding}
              onClick={() => void handleAddMembers()}
              startIcon={<UserPlus />}
              sx={{
                minWidth: 80,
                width: { xs: "100%", sm: "auto" },
                whiteSpace: "nowrap",
              }}
              type="button"
              variant="contained"
            >
              {selectedCandidates.length > 1
                ? `Add ${selectedCandidates.length}`
                : "Add"}
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
                          <Trash2 fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  }
                >
                  <ListItemAvatar>
                    <UserAvatar name={member.name} surname={member.surname} />
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
