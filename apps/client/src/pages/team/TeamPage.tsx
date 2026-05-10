import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { RoleKey } from "@syncr/packages";
import { CircleCheck, Mail, MoreVertical } from "lucide-mui";
import { useState } from "react";

import { useInviteTeamMembers } from "@/api/invitations";
import { useGetTeam } from "@/api/team";
import { UserAvatar } from "@/components/UserAvatar";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getUserFullName } from "@/utils/getUserFullName";

import { StatCard } from "./components/StatCard";
import { formatPercent, normalizeWorkload } from "./utils/format";

const getWorkloadColor = (workload: number) => {
  if (workload >= 0.8) {
    return "success";
  }

  if (workload >= 0.4) {
    return "warning";
  }

  return "error";
};

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

export const TeamPage = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [emails, setEmails] = useState("");
  const [roleKey, setRoleKey] = useState<RoleKey>(RoleKey.Developer);
  const [formError, setFormError] = useState<string | null>(null);
  const { data, isLoading } = useGetTeam();
  const inviteTeamMembers = useInviteTeamMembers();

  const members = data?.members ?? [];
  const invitations = data?.invitations ?? [];

  const handleInviteDialogClose = () => {
    setIsInviteDialogOpen(false);
    setEmails("");
    setRoleKey(RoleKey.Developer);
    setFormError(null);
  };

  const handleInviteSubmit = async () => {
    setFormError(null);

    const inviteEmails = parseEmails(emails);

    if (inviteEmails.length === 0) {
      setFormError("Enter at least one email address.");

      return;
    }

    try {
      await inviteTeamMembers.mutateAsync({
        emails: inviteEmails,
        roleKey,
      });
      handleInviteDialogClose();
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not invite team members."));
    }
  };

  return (
    <Stack component="main" width="100%" minHeight="100%" p={3} gap={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack gap={0.5}>
          <Typography variant="h4">Team Management</Typography>
          <Typography color="text.secondary">
            Manage team members and their workload
          </Typography>
        </Stack>
        <Button
          onClick={() => setIsInviteDialogOpen(true)}
          startIcon={<Mail />}
          variant="contained"
        >
          Invite Member
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <StatCard label="Total Members" value={data?.totalMembers ?? 0} />
        <StatCard label="Active Projects" value={data?.activeProjects ?? 0} />
        <StatCard
          label="Avg. Workload"
          value={data ? formatPercent(data.averageWorkload) : "0%"}
        />
        <StatCard label="Tasks Completed" value={data?.tasksCompleted ?? 0} />
      </Box>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 1080 }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "background.default",
                "& th": {
                  borderBottomColor: "divider",
                  color: "text.secondary",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: 0,
                  py: 1.5,
                  textTransform: "uppercase",
                },
              }}
            >
              <TableCell>Member</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Assigned Tasks</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Workload</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Stack alignItems="center" py={6}>
                    <CircularProgress />
                  </Stack>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && members.length === 0 && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Stack alignItems="center" py={6}>
                    <Typography color="text.secondary">
                      No team members found.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              members.map((member) => {
                const workload = normalizeWorkload(member.workload);
                const workloadColor = getWorkloadColor(workload);

                return (
                  <TableRow
                    key={member.id}
                    hover
                    sx={{
                      "& td": {
                        py: 2,
                      },
                    }}
                  >
                    <TableCell>
                      <Stack alignItems="center" direction="row" gap={1.5}>
                        <UserAvatar
                          name={member.name}
                          size={36}
                          surname={member.surname}
                        />
                        <Typography variant="subtitle2">
                          {getUserFullName(member.name, member.surname)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.secondary" variant="body2">
                        {member.roleName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.secondary" variant="body2">
                        {member.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {member.assignedTasks}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" gap={0.75}>
                        <CircleCheck
                          color="success"
                          sx={{ fontSize: 17 }}
                        />
                        <Typography color="text.secondary" variant="body2">
                          {member.completedTasks}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" gap={1.25}>
                        <LinearProgress
                          color={workloadColor}
                          value={workload * 100}
                          variant="determinate"
                          sx={{
                            bgcolor: "action.disabledBackground",
                            borderRadius: 999,
                            height: 6,
                            width: 42,
                          }}
                        />
                        <Typography color="text.secondary" variant="body2">
                          {formatPercent(workload)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          member.status === "active" ? "success" : "default"
                        }
                        label={member.status}
                        size="small"
                        sx={{
                          borderRadius: 999,
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Member actions">
                        <IconButton aria-label="Member actions" size="small">
                          <MoreVertical />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          px={2.5}
          py={2}
        >
          <Typography variant="h6">Pending Invitations</Typography>
          <Chip label={invitations.length} size="small" />
        </Stack>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "background.default",
                "& th": {
                  borderBottomColor: "divider",
                  color: "text.secondary",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: 0,
                  py: 1.5,
                  textTransform: "uppercase",
                },
              }}
            >
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Stack alignItems="center" py={4}>
                    <Typography color="text.secondary">
                      No pending invitations.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>{invitation.roleName}</TableCell>
                  <TableCell>
                    <Chip
                      label={invitation.status}
                      size="small"
                      sx={{
                        borderRadius: 999,
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        fullWidth
        maxWidth="xs"
        onClose={handleInviteDialogClose}
        open={isInviteDialogOpen}
      >
        <DialogTitle>Invite team members</DialogTitle>
        <DialogContent>
          <Stack gap={2} pt={1}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              autoFocus
              label="Email addresses"
              minRows={3}
              multiline
              onChange={(event) => setEmails(event.target.value)}
              placeholder="name@example.com, teammate@example.com"
              value={emails}
            />
            <FormControl fullWidth>
              <InputLabel id="invite-role-label">Role</InputLabel>
              <Select
                label="Role"
                labelId="invite-role-label"
                onChange={(event) => setRoleKey(event.target.value as RoleKey)}
                value={roleKey}
              >
                {ROLE_OPTIONS.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInviteDialogClose}>Cancel</Button>
          <Button
            disabled={inviteTeamMembers.isPending}
            onClick={() => void handleInviteSubmit()}
            variant="contained"
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
