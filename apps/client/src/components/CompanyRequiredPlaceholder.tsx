import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { type UserInvitation } from "@syncr/packages";

import {
  useAcceptInvitation,
  useDeclineInvitation,
  useGetPendingInvitations,
} from "@/api/invitations";
import { useCompanyStore } from "@/store/useCompanyStore";

import { CompanyInvitationCard } from "./CompanyInvitationCard";
import { HEADER_HEIGHT } from "./Header";

export const CompanyRequiredPlaceholder = () => {
  const setSelectedCompanyId = useCompanyStore(
    (state) => state.setSelectedCompanyId,
  );
  const { data: pendingInvitations = [], isPending: areInvitationsPending } =
    useGetPendingInvitations();
  const acceptInvitation = useAcceptInvitation();
  const declineInvitation = useDeclineInvitation();

  const handleAcceptInvitation = async (invitation: UserInvitation) => {
    await acceptInvitation.mutateAsync(invitation.id);
    setSelectedCompanyId(invitation.companyId);
  };

  return (
    <Stack
      alignItems="center"
      component="main"
      gap={1}
      justifyContent="center"
      minHeight={`calc(100vh - ${HEADER_HEIGHT}px)`}
      sx={{ width: "100%", p: 3, textAlign: "center" }}
    >
      {areInvitationsPending ? (
        <CircularProgress />
      ) : pendingInvitations.length > 0 ? (
        <Stack gap={2} maxWidth={640} width="100%">
          <Stack gap={0.5}>
            <Typography variant="h5">Pending invitations</Typography>
            <Typography color="text.secondary">
              Accept an invitation to open its company workspace.
            </Typography>
          </Stack>
          <Paper
            variant="outlined"
            sx={{ overflow: "hidden", textAlign: "left" }}
          >
            {pendingInvitations.map((invitation, index) => (
              <Box key={invitation.id}>
                <CompanyInvitationCard
                  invitation={invitation}
                  isAccepting={acceptInvitation.isPending}
                  isDeclining={declineInvitation.isPending}
                  onAccept={(invitation) =>
                    void handleAcceptInvitation(invitation)
                  }
                  onDecline={(invitation) =>
                    declineInvitation.mutate(invitation.id)
                  }
                />
                {index < pendingInvitations.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Stack>
      ) : (
        <>
          <Typography variant="h5">Please select a company</Typography>
          <Typography color="text.secondary">
            Choose a company from the header to continue.
          </Typography>
        </>
      )}
    </Stack>
  );
};
