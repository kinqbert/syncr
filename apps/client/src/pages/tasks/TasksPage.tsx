import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";

import {
  useAddProjectMember,
  useGetProject,
  useGetProjectAssignees,
  useGetProjectMemberCandidates,
  useRemoveProjectMember,
} from "@/api/projects";
import { ProjectViewNav } from "@/components/ProjectViewNav";

import { Kanban } from "./components/Kanban";
import { ProjectMembersDialog } from "./components/ProjectMembersDialog";

export const TasksPage = () => {
  const { projectId } = useParams();
  const numericProjectId = Number(projectId);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);

  const { data: project } = useGetProject(numericProjectId, Boolean(projectId));
  const { data: members = [], isLoading: isMembersLoading } =
    useGetProjectAssignees(numericProjectId, Boolean(projectId));
  const { data: memberCandidates = [], isLoading: isMemberCandidatesLoading } =
    useGetProjectMemberCandidates(
      numericProjectId,
      Boolean(projectId) && isMembersDialogOpen,
    );

  const addProjectMember = useAddProjectMember();
  const removeProjectMember = useRemoveProjectMember();

  if (!projectId) {
    return null;
  }

  const handleAddProjectMember = async (userId: number) => {
    await addProjectMember.mutateAsync({
      projectId: numericProjectId,
      body: { userId },
    });
  };

  const handleRemoveProjectMember = async (userId: number) => {
    await removeProjectMember.mutateAsync({
      projectId: numericProjectId,
      userId,
    });
  };

  return (
    <Stack height="100%" minWidth={0} p={3} width="100%">
      <Stack
        alignItems={{ xs: "flex-start", sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        mb={2}
        gap={2}
      >
        <Stack minWidth={0} gap={0.5}>
          <Typography variant="h4">{project?.name}</Typography>
          <Typography color="text.secondary">
            Drag and drop tasks to update their status
          </Typography>
        </Stack>
        <ProjectViewNav projectId={numericProjectId} />
      </Stack>
      <Box minHeight={0} minWidth={0} sx={{ flex: 1, overflowX: "scroll" }}>
        <Kanban projectAssignees={members} />
      </Box>
      <ProjectMembersDialog
        candidates={memberCandidates}
        isAdding={addProjectMember.isPending}
        isCandidatesLoading={isMemberCandidatesLoading}
        isMembersLoading={isMembersLoading}
        isOpen={isMembersDialogOpen}
        isRemoving={removeProjectMember.isPending}
        members={members}
        onAddMember={handleAddProjectMember}
        onClose={() => setIsMembersDialogOpen(false)}
        onRemoveMember={handleRemoveProjectMember}
      />
    </Stack>
  );
};
