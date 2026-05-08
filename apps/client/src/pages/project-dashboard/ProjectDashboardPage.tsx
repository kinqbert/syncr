import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type {
  ProjectAssignee,
  Task,
  TaskStatus as TaskStatusType,
} from "@syncr/packages";
import { TASK_STATUS_LABEL, TaskStatus } from "@syncr/packages";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  FolderKanban,
  ListChecks,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-mui";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router";

import {
  useAddProjectMember,
  useGetProject,
  useGetProjectAssignees,
  useGetProjectMemberCandidates,
  useRemoveProjectMember,
} from "@/api/projects";
import { useGetProjectTasks } from "@/api/tasks";
import { UserAvatar } from "@/components/UserAvatar";
import { useProject } from "@/hooks";
import { ProjectMembersDialog } from "@/pages/tasks/components/ProjectMembersDialog";
import { formatDate } from "@/utils/formatDate";
import { getUserFullName } from "@/utils/getUserFullName";

const statusOrder: TaskStatusType[] = [
  TaskStatus.Backlog,
  TaskStatus.Todo,
  TaskStatus.InProgress,
  TaskStatus.Review,
  TaskStatus.Done,
];

const getCompletionProgress = (tasks: Task[]) => {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.Done,
  );

  return Math.round((completedTasks.length / tasks.length) * 100);
};

const getTaskCountByStatus = (tasks: Task[]) => {
  return statusOrder.reduce<Record<TaskStatusType, number>>(
    (counts, status) => ({
      ...counts,
      [status]: tasks.filter((task) => task.status === status).length,
    }),
    {
      [TaskStatus.Backlog]: 0,
      [TaskStatus.Todo]: 0,
      [TaskStatus.InProgress]: 0,
      [TaskStatus.Review]: 0,
      [TaskStatus.Done]: 0,
    },
  );
};

const getAssignedTaskCount = (tasks: Task[], memberId: number) => {
  return tasks.filter((task) => task.assignee?.id === memberId).length;
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

const buildActivityItems = (tasks: Task[]) => {
  const completed = tasks
    .filter((task) => task.status === TaskStatus.Done)
    .slice(0, 2)
    .map((task) => ({
      id: `done-${task.id}`,
      actor: task.assignee,
      title: `${task.assignee ? getUserFullName(task.assignee.name, task.assignee.surname) : "A teammate"} completed "${task.name}"`,
      meta: "Marked done",
    }));
  const active = tasks
    .filter((task) => task.status === TaskStatus.InProgress)
    .slice(0, 2)
    .map((task) => ({
      id: `active-${task.id}`,
      actor: task.assignee,
      title: `${task.assignee ? getUserFullName(task.assignee.name, task.assignee.surname) : "A teammate"} is working on "${task.name}"`,
      meta: "In progress",
    }));

  return [...active, ...completed].slice(0, 4);
};

type StatCardProps = {
  helper: string;
  icon: ReactNode;
  label: string;
  value: string | number;
};

const StatCard = ({ helper, icon, label, value }: StatCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        height: "100%",
        p: 2.5,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Stack gap={1}>
          <Typography color="text.secondary" fontSize={13} fontWeight={600}>
            {label}
          </Typography>
          <Typography fontSize={24} fontWeight={800}>
            {value}
          </Typography>
          <Typography color="text.secondary" fontSize={13}>
            {helper}
          </Typography>
        </Stack>
        <Box sx={{ color: "text.disabled" }}>{icon}</Box>
      </Stack>
    </Paper>
  );
};

export const ProjectDashboardPage = () => {
  const { projectId } = useProject();
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const { data: project, isLoading: isProjectLoading } =
    useGetProject(projectId);
  const { data: tasks = [], isLoading: areTasksLoading } =
    useGetProjectTasks(projectId);
  const { data: members = [], isLoading: areMembersLoading } =
    useGetProjectAssignees(projectId);
  const { data: memberCandidates = [], isLoading: isMemberCandidatesLoading } =
    useGetProjectMemberCandidates(projectId, isMembersDialogOpen);
  const addProjectMember = useAddProjectMember();
  const removeProjectMember = useRemoveProjectMember();

  const isLoading = isProjectLoading || areTasksLoading || areMembersLoading;
  const completedTasksCount = tasks.filter(
    (task) => task.status === TaskStatus.Done,
  ).length;
  const inProgressTasksCount = tasks.filter(
    (task) => task.status === TaskStatus.InProgress,
  ).length;
  const completionProgress = getCompletionProgress(tasks);
  const statusCounts = getTaskCountByStatus(tasks);
  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);
  const managerName = getManagerName(project?.managerId, members);
  const activityItems = buildActivityItems(tasks);

  const handleAddProjectMember = async (userId: number) => {
    await addProjectMember.mutateAsync({
      projectId,
      body: { userId },
    });
  };

  const handleRemoveProjectMember = async (userId: number) => {
    await removeProjectMember.mutateAsync({
      projectId,
      userId,
    });
  };

  if (isLoading) {
    return (
      <Stack alignItems="center" height="100%" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (!project) {
    return (
      <Stack alignItems="center" height="100%" justifyContent="center">
        <Typography color="text.secondary">Project not found.</Typography>
      </Stack>
    );
  }

  return (
    <Box
      component="main"
      sx={{ height: "100%", overflow: "auto", p: 3, width: "100%" }}
    >
      <Stack gap={3}>
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
              alignItems={{ xs: "flex-start", sm: "center" }}
              direction={{ xs: "column", sm: "row" }}
              gap={2}
              justifyContent="space-between"
            >
              <Stack gap={0.75}>
                <Stack alignItems="center" direction="row" gap={1}>
                  <Typography fontSize={24} fontWeight={800}>
                    {project.name}
                  </Typography>
                  <Chip
                    label={project.status}
                    size="small"
                    sx={{
                      bgcolor: "#EEF2FF",
                      color: "primary.main",
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                  />
                </Stack>
                <Typography color="text.secondary">
                  Project dashboard, task progress, and team workload at a
                  glance.
                </Typography>
              </Stack>

              <Button
                component={Link}
                endIcon={<ArrowRight />}
                to={`/projects/${projectId}/tasks`}
                variant="contained"
              >
                Open task board
              </Button>
            </Stack>

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
                    <CalendarDays
                      sx={{ color: "text.secondary", fontSize: 17 }}
                    />
                    <Typography fontWeight={700}>
                      {project.endDate
                        ? formatDate(project.endDate)
                        : "No deadline"}
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
                      {members.length}{" "}
                      {members.length === 1 ? "member" : "members"}
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

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          <StatCard
            helper={`${completedTasksCount} completed`}
            icon={<Activity size={20} />}
            label="Total Tasks"
            value={tasks.length}
          />
          <StatCard
            helper="Currently active tasks"
            icon={<FolderKanban size={20} />}
            label="In Progress"
            value={inProgressTasksCount}
          />
          <StatCard
            helper={`${completedTasksCount} of ${tasks.length} tasks done`}
            icon={<TrendingUp size={20} />}
            label="Completion Rate"
            value={`${completionProgress}%`}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            alignItems: "stretch",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              height: "100%",
              minWidth: 0,
              p: 2.5,
            }}
          >
            <Stack gap={3} height="100%">
              <Typography fontSize={17} fontWeight={800}>
                Task Distribution
              </Typography>
              <Stack
                alignItems="end"
                direction="row"
                gap={2}
                sx={{
                  flex: 1,
                  minHeight: 230,
                  minWidth: 0,
                  overflowX: "auto",
                  pb: 1,
                }}
              >
                {statusOrder.map((status) => {
                  const count = statusCounts[status];
                  const height = Math.max((count / maxStatusCount) * 180, 10);

                  return (
                    <Stack
                      key={status}
                      alignItems="center"
                      gap={1}
                      sx={{ flex: "1 0 86px", minWidth: 0 }}
                    >
                      <Box
                        sx={{
                          bgcolor: "primary.main",
                          borderRadius: "8px 8px 0 0",
                          height,
                          transition: "height 180ms ease",
                          width: "100%",
                        }}
                      />
                      <Typography color="text.secondary" fontSize={12}>
                        {TASK_STATUS_LABEL[status]}
                      </Typography>
                      <Typography fontSize={13} fontWeight={800}>
                        {count}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              height: "100%",
              minWidth: 0,
              p: 2.5,
            }}
          >
            <Stack gap={2}>
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
              >
                <Typography fontSize={17} fontWeight={800}>
                  Team Members
                </Typography>
                <Tooltip title="Manage project members">
                  <IconButton
                    aria-label="Manage project members"
                    onClick={() => setIsMembersDialogOpen(true)}
                    size="small"
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: "action.selected",
                        color: "primary.main",
                      },
                    }}
                  >
                    <UserPlus fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack gap={1.75}>
                {members.length === 0 ? (
                  <Typography color="text.secondary" fontSize={14}>
                    No members assigned yet.
                  </Typography>
                ) : null}
                {members.slice(0, 5).map((member) => (
                  <Stack
                    key={member.id}
                    alignItems="center"
                    direction="row"
                    gap={1.25}
                  >
                    <UserAvatar
                      name={member.name}
                      size={34}
                      surname={member.surname}
                    />
                    <Stack minWidth={0} sx={{ flex: 1 }}>
                      <Typography noWrap fontSize={14} fontWeight={700}>
                        {getUserFullName(member.name, member.surname)}
                      </Typography>
                      <Typography color="text.secondary" fontSize={12}>
                        {member.id === project.managerId
                          ? "Project Manager"
                          : "Member"}
                      </Typography>
                    </Stack>
                    <Typography color="text.secondary" fontSize={13}>
                      {getAssignedTaskCount(tasks, member.id)} tasks
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2.5 }}
        >
          <Stack gap={2.25}>
            <Stack alignItems="center" direction="row" gap={1}>
              <ListChecks sx={{ color: "primary.main", fontSize: 19 }} />
              <Typography fontSize={17} fontWeight={800}>
                Activity Timeline
              </Typography>
            </Stack>

            {activityItems.length === 0 ? (
              <Typography color="text.secondary" fontSize={14}>
                No active or completed work to summarize yet.
              </Typography>
            ) : null}

            {activityItems.map((item) => (
              <Stack
                key={item.id}
                alignItems="center"
                direction="row"
                gap={1.5}
              >
                <UserAvatar
                  name={item.actor?.name}
                  size={32}
                  surname={item.actor?.surname}
                />
                <Stack minWidth={0}>
                  <Typography noWrap fontSize={14}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary" fontSize={12}>
                    {item.meta}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Stack>
      <ProjectMembersDialog
        candidates={memberCandidates}
        isAdding={addProjectMember.isPending}
        isCandidatesLoading={isMemberCandidatesLoading}
        isMembersLoading={areMembersLoading}
        isOpen={isMembersDialogOpen}
        isRemoving={removeProjectMember.isPending}
        members={members}
        onAddMember={handleAddProjectMember}
        onClose={() => setIsMembersDialogOpen(false)}
        onRemoveMember={handleRemoveProjectMember}
      />
    </Box>
  );
};
