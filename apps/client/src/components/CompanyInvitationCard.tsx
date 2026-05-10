import { Button, Chip, Stack, Typography } from "@mui/material";
import { type UserInvitation } from "@syncr/packages";
import { Building2, Check, UserPlus, X } from "lucide-mui";

type CompanyInvitationCardProps = {
  invitation: UserInvitation;
  isAccepting: boolean;
  isDeclining: boolean;
  onAccept: (invitation: UserInvitation) => void;
  onDecline: (invitation: UserInvitation) => void;
};

export const CompanyInvitationCard = ({
  invitation,
  isAccepting,
  isDeclining,
  onAccept,
  onDecline,
}: CompanyInvitationCardProps) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      gap={2}
      p={2.5}
      sx={{
        alignItems: { xs: "stretch", sm: "center" },
        bgcolor: "background.paper",
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          bgcolor: "#ECFDF5",
          borderRadius: 2,
          color: "#059669",
          flex: "0 0 auto",
          height: 48,
          width: 48,
        }}
      >
        <UserPlus fontSize="small" />
      </Stack>

      <Stack gap={0.75} minWidth={0} sx={{ flex: 1 }}>
        <Stack
          alignItems={{ xs: "flex-start", sm: "center" }}
          direction={{ xs: "column", sm: "row" }}
          gap={1}
        >
          <Stack alignItems="center" direction="row" gap={0.75} minWidth={0}>
            <Building2 color="action" sx={{ fontSize: 18 }} />
            <Typography fontWeight={700} noWrap>
              {invitation.companyName}
            </Typography>
          </Stack>
          <Chip
            label={invitation.roleName}
            size="small"
            sx={{
              bgcolor: "action.hover",
              borderRadius: 999,
              fontWeight: 600,
            }}
          />
        </Stack>
        <Typography color="text.secondary" variant="body2">
          You have been invited to join this company workspace.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={1}
        sx={{ flex: "0 0 auto" }}
      >
        <Button
          disabled={isAccepting}
          onClick={() => onAccept(invitation)}
          startIcon={<Check />}
          variant="contained"
        >
          Accept
        </Button>
        <Button
          color="inherit"
          disabled={isDeclining}
          onClick={() => onDecline(invitation)}
          startIcon={<X />}
          variant="outlined"
        >
          Decline
        </Button>
      </Stack>
    </Stack>
  );
};
