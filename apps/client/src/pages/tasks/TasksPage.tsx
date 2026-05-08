import { Box, Button, Stack, Typography } from "@mui/material";
import { Users } from "lucide-mui";
import { useState } from "react";
import { useParams } from "react-router";

import {
  useAddProjectMember,
  useGetProject,
  useGetProjectAssignees,
  useGetProjectMemberCandidates,
  useRemoveProjectMember,
} from "@/api/projects";

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
    <Stack height="100%" minWidth={0} width="100%" p={3}>
      <Stack
        alignItems={{ xs: "flex-start", sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        mb={2}
        gap={2}
      >
        <Stack minWidth={0}>
          <Typography variant="h5">{project?.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Drag and drop tasks to update their status
          </Typography>
        </Stack>
        <Button
          onClick={() => setIsMembersDialogOpen(true)}
          startIcon={<Users />}
          sx={{ whiteSpace: "nowrap" }}
          variant="outlined"
        >
          {members.length} members
        </Button>
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
