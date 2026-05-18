import {
  Alert,
  Box,
  capitalize,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { Project, ProjectAssignee } from "@syncr/packages";
import { CalendarDays, Info, Users } from "lucide-mui";

import { useGetProjectAssignees } from "@/api/projects";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getUserFullName } from "@/utils/getUserFullName";

type ProjectDashboardHeaderProps = {
  project?: Project | null;
  isProjectLoading?: boolean;
};

const getManagerName = (
  managerId: number | null | undefined,
  members: ProjectAssignee[],
) => {
  if (!managerId) {
    return "Unassigned";
  }

  const manager = members.find((member) => member.id === managerId);

  return manager ? getUserFullName(manager.name, manager.surname) : "Unknown";
};

const getCompletionProgress = (project: Project) => {
  if (project.totalTasksCount === 0) {
    return 0;
  }

  return Math.round(
    (project.completedTasksCount / project.totalTasksCount) * 100,
  );
};

export const ProjectDashboardHeader = ({
  project,
  isProjectLoading = false,
}: ProjectDashboardHeaderProps) => {
  const {
    data: members = [],
    error: membersError,
    isError: areMembersError,
    isLoading: areMembersLoading,
  } = useGetProjectAssignees(project?.id ?? 0, Boolean(project));

  const isLoading = isProjectLoading || areMembersLoading;

  if (areMembersError) {
    return (
      <Alert severity="error">
        {getErrorMessage(membersError, "Could not load project members.")}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Stack alignItems="center" py={3}>
          <CircularProgress size={28} />
        </Stack>
      </Paper>
    );
  }

  if (!project) {
    return null;
  }

  const managerName = getManagerName(project.managerId, members);
  const completionProgress = getCompletionProgress(project);

  const STATS: {
    id: number;
    label: string;
    value: string;
    icon?: React.ComponentType<{ sx: { color: string; fontSize: number } }>;
  }[] = [
    {
      id: 0,
      label: "Project Manager",
      value: managerName,
    },
    {
      id: 1,
      label: "Deadline",
      value: project.endDate ? formatDate(project.endDate) : "No deadline",
      icon: CalendarDays,
    },
    {
      id: 2,
      label: "Status",
      value: capitalize(project.status),
      icon: Info,
    },
    {
      id: 3,
      label: "Team Size",
      value: `${members.length} ${members.length === 1 ? "member" : "members"}`,
      icon: Users,
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack gap={{ xs: 2.5, sm: 3 }} minWidth={0}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={{ xs: 2.5, md: 3 }}
          justifyContent="space-between"
        >
          <Box
            sx={{
              display: "grid",
              gap: { xs: 2, sm: 2.5, md: 4 },
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              minWidth: 0,
              width: "100%",
            }}
          >
            {STATS.map((stat) => {
              const Icon = stat.icon;

              return (
                <Stack key={stat.id} gap={0.75} minWidth={0}>
                  <Typography color="text.secondary" fontSize={13}>
                    {stat.label}
                  </Typography>
                  <Stack alignItems="center" direction="row" gap={0.75} minWidth={0}>
                    {Icon && (
                      <Icon sx={{ color: "text.secondary", fontSize: 17 }} />
                    )}
                    <Typography noWrap fontWeight={700} minWidth={0}>
                      {stat.value}
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Box>

          <Stack gap={1} minWidth={{ xs: "100%", md: 300 }}>
            <Typography color="text.secondary" fontSize={13}>
              Overall Progress
            </Typography>
            <Stack alignItems="center" direction="row" gap={1.5}>
              <LinearProgress
                value={completionProgress}
                variant="determinate"
                sx={{
                  bgcolor: "#E5E7EB",
                  borderRadius: 999,
                  flex: 1,
                  height: 8,
                  ".MuiLinearProgress-bar": {
                    background:
                      "linear-gradient(90deg, #4F46E5 0%, #2563EB 100%)",
                    borderRadius: 999,
                  },
                }}
              />
              <Typography fontSize={13} fontWeight={800}>
                {completionProgress}%
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};
