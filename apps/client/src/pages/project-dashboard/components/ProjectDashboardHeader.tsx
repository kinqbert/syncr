import {
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
  const { data: members = [], isLoading: areMembersLoading } =
    useGetProjectAssignees(project?.id ?? 0, Boolean(project));

  const isLoading = isProjectLoading || areMembersLoading;

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 3 }}
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

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Stack gap={3}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={3}
          justifyContent="space-between"
        >
          <Stack direction={{ xs: "column", sm: "row" }} gap={4}>
            <Stack gap={0.75}>
              <Typography color="text.secondary" fontSize={13}>
                Project Manager
              </Typography>
              <Typography fontWeight={700}>{managerName}</Typography>
            </Stack>
            <Stack gap={0.75}>
              <Typography color="text.secondary" fontSize={13}>
                Deadline
              </Typography>
              <Stack alignItems="center" direction="row" gap={0.75}>
                <CalendarDays sx={{ color: "text.secondary", fontSize: 17 }} />
                <Typography fontWeight={700}>
                  {project.endDate
                    ? formatDate(project.endDate)
                    : "No deadline"}
                </Typography>
              </Stack>
            </Stack>
            <Stack gap={0.75}>
              <Typography color="text.secondary" fontSize={13}>
                Status
              </Typography>
              <Stack alignItems="center" direction="row" gap={0.75}>
                <Info sx={{ color: "text.secondary", fontSize: 17 }} />
                <Typography fontWeight={700}>
                  {capitalize(project.status)}
                </Typography>
              </Stack>
            </Stack>
            <Stack gap={0.75}>
              <Typography color="text.secondary" fontSize={13}>
                Team Size
              </Typography>
              <Stack alignItems="center" direction="row" gap={0.75}>
                <Users sx={{ color: "text.secondary", fontSize: 17 }} />
                <Typography fontWeight={700}>
                  {members.length} {members.length === 1 ? "member" : "members"}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

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
