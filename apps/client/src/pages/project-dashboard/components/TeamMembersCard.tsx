import { Alert, Box, Button, Stack } from "@mui/material";
import type { Task } from "@syncr/packages";
import { UserPlus, Users } from "lucide-mui";
import { useState } from "react";

import {
  useAddProjectMember,
  useGetProject,
  useGetProjectAssignees,
  useGetProjectMemberCandidates,
  useRemoveProjectMember,
} from "@/api/projects";
import { EmptyState, ListRow, RowSkeleton, Section } from "@/components/ui";
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
      <Section
        actions={
          <Button
            onClick={() => setIsMembersDialogOpen(true)}
            size="small"
            startIcon={<UserPlus />}
          >
            Manage
          </Button>
        }
        icon={<Users />}
        padding="none"
        title={members.length > 0 ? `Team · ${members.length}` : "Team"}
      >
        <Box sx={{ p: 1 }}>
          {areMembersLoading ? <RowSkeleton count={4} /> : null}

          {areMembersError ? (
            <Alert severity="error">
              {getErrorMessage(membersError, "Could not load members.")}
            </Alert>
          ) : null}

          {!areMembersLoading && !areMembersError && members.length === 0 ? (
            <EmptyState
              compact
              description="Add people so tasks can be assigned to them."
              title="No members yet"
            />
          ) : null}

          {!areMembersError &&
            members.map((member) => (
              <ListRow
                key={member.id}
                leading={
                  <UserAvatar name={member.name} size={22} surname={member.surname} />
                }
                title={getUserFullName(member.name, member.surname)}
                trailing={
                  <Stack component="span" direction="row" gap={1}>
                    {member.id === project?.managerId && (
                      <Box component="span" sx={{ color: "accent.text" }}>
                        Manager
                      </Box>
                    )}
                    <span>{getAssignedTaskCount(tasks, member.id)} tasks</span>
                  </Stack>
                }
              />
            ))}
        </Box>
      </Section>

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
