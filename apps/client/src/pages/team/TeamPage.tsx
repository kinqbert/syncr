import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import { useGetTeam } from "@/api/team";
import { getUserFullName } from "@/utils/getUserFullName";
import { getUserInitials } from "@/utils/getUserInitials";

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

export const TeamPage = () => {
  const { data, isLoading } = useGetTeam();

  const members = data?.members ?? [];

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
        <Button startIcon={<MailOutlineIcon />} variant="contained">
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
                        <Avatar
                          sx={{
                            bgcolor: "rgba(79, 70, 229, 0.16)",
                            color: "primary.main",
                            fontSize: 13,
                            fontWeight: 500,
                            height: 36,
                            width: 36,
                          }}
                        >
                          {getUserInitials(member.name, member.surname)}
                        </Avatar>
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
                        <CheckCircleOutlineIcon
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
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
