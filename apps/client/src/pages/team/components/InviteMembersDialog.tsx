import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { RoleKey } from "@syncr/packages";
import { useState } from "react";

import { useInviteTeamMembers } from "@/api/invitations";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getErrorMessage } from "@/utils/getErrorMessage";

const ROLE_OPTIONS = [
  { label: "Project Manager", value: RoleKey.ProjectManager },
  { label: "Developer", value: RoleKey.Developer },
] as const;

const parseEmails = (value: string) => {
  return [
    ...new Set(
      value
        .split(/[\s,;]+/)
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
};

type InviteMembersDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const InviteMembersDialog = ({
  onClose,
  open,
}: InviteMembersDialogProps) => {
  const isMobile = useIsMobile();
  const [emails, setEmails] = useState("");
  const [roleKey, setRoleKey] = useState<RoleKey>(RoleKey.Developer);
  const [formError, setFormError] = useState<string | null>(null);
  const inviteTeamMembers = useInviteTeamMembers();

  const handleClose = () => {
    onClose();
    setEmails("");
    setRoleKey(RoleKey.Developer);
    setFormError(null);
  };

  const handleSubmit = async () => {
    setFormError(null);

    const inviteEmails = parseEmails(emails);

    if (inviteEmails.length === 0) {
      setFormError("Enter at least one email address.");
      return;
    }

    try {
      await inviteTeamMembers.mutateAsync({ emails: inviteEmails, roleKey });
      handleClose();
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not invite team members."));
    }
  };

  return (
    <Dialog
      fullScreen={isMobile}
      fullWidth
      maxWidth="xs"
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>Invite people</DialogTitle>
      <DialogContent>
        <Stack gap={2} pt={1}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            autoFocus
            helperText="Separate addresses with commas or new lines."
            label="Email addresses"
            minRows={3}
            multiline
            onChange={(event) => setEmails(event.target.value)}
            placeholder="name@example.com, teammate@example.com"
            value={emails}
          />
          <TextField
            label="Role"
            onChange={(event) => setRoleKey(event.target.value as RoleKey)}
            select
            value={roleKey}
          >
            {ROLE_OPTIONS.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          disabled={inviteTeamMembers.isPending}
          onClick={() => void handleSubmit()}
          variant="contained"
        >
          Send invites
        </Button>
      </DialogActions>
    </Dialog>
  );
};
