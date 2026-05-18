import {
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { Task } from "@syncr/packages";
import { UserPlus } from "lucide-mui";
import { useState } from "react";

import {
  useAddProjectMember,
  useGetProject,
  useGetProjectAssignees,
  useGetProjectMemberCandidates,
  useRemoveProjectMember,
} from "@/api/projects";
import { UserAvatar } from "@/components/UserAvatar";
import { ProjectMembersDialog } from "@/pages/tasks/components/ProjectMembersDialog";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getUserFullName } from "@/utils/getUserFullName";

type TeamMembersCardProps = {
  projectId: number;
  tasks: Task[];
};

const getAssignedTaskCount = (tasks: Task[], memberId: number) => {
  return tasks.filter((task) => task.assignee?.id === memberId).length;
};

export const TeamMembersCard = ({
  projectId,
  tasks,
}: TeamMembersCardProps) => {
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const { data: project } = useGetProject(projectId);
  const {
    data: members = [],
    error: membersError,
    isError: areMembersError,
    isLoading: areMembersLoading,
  } = useGetProjectAssignees(projectId);
  const { data: memberCandidates = [], isLoading: isMemberCandidatesLoading } =
    useGetProjectMemberCandidates(projectId, isMembersDialogOpen);
  const addProjectMember = useAddProjectMember();
  const removeProjectMember = useRemoveProjectMember();

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

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          height: "100%",
          minWidth: 0,
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Stack gap={2} minWidth={0}>
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
            {areMembersLoading ? (
              <Stack alignItems="center" py={1}>
                <CircularProgress size={24} />
              </Stack>
            ) : null}

            {areMembersError ? (
              <Alert severity="error">
                {getErrorMessage(membersError, "Could not load members.")}
              </Alert>
            ) : null}

            {!areMembersLoading && !areMembersError && members.length === 0 ? (
              <Typography color="text.secondary" fontSize={14}>
                No members assigned yet.
              </Typography>
            ) : null}

            {!areMembersError && members.slice(0, 5).map((member) => (
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
                    {member.id === project?.managerId
                      ? "Project Manager"
                      : "Member"}
                  </Typography>
                </Stack>
                <Typography color="text.secondary" flexShrink={0} fontSize={13}>
                  {getAssignedTaskCount(tasks, member.id)} tasks
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Paper>

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
    </>
  );
};
