import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { TeamMember } from "@syncr/packages";
import { ConversationType } from "@syncr/packages";
import { MessageCircle, Users } from "lucide-mui";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  useCreateDirectConversation,
  useCreateGroupConversation,
} from "@/api/conversations";
import { useGetTeamMembers } from "@/api/team";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { ConversationAvatar } from "./ConversationAvatar";
import { getMemberLabel } from "./utils";

type ConversationMode = "direct" | "group";

type NewConversationDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const NewConversationDialog = ({
  onClose,
  open,
}: NewConversationDialogProps) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ConversationMode>("direct");
  const [directMember, setDirectMember] = useState<TeamMember | null>(null);
  const [groupMembers, setGroupMembers] = useState<TeamMember[]>([]);
  const [groupTitle, setGroupTitle] = useState("");
  const currentUser = useAuthStore((state) => state.user);
  const { data: members = [], isLoading: membersLoading } = useGetTeamMembers();
  const createDirectConversation = useCreateDirectConversation();
  const createGroupConversation = useCreateGroupConversation();

  const memberOptions = useMemo(
    () =>
      members
        .filter((member) => member.id !== currentUser?.id)
        .slice()
        .sort((first, second) =>
          getMemberLabel(first).localeCompare(getMemberLabel(second)),
        ),
    [currentUser?.id, members],
  );

  const isSubmitting =
    createDirectConversation.isPending || createGroupConversation.isPending;
  const canSubmit =
    mode === "direct"
      ? Boolean(directMember)
      : groupTitle.trim().length > 0 && groupMembers.length > 0;

  const reset = () => {
    setMode("direct");
    setDirectMember(null);
    setGroupMembers([]);
    setGroupTitle("");
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    reset();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const conversation =
        mode === "direct"
          ? await createDirectConversation.mutateAsync({
              targetUserId: directMember!.id,
            })
          : await createGroupConversation.mutateAsync({
              targetUserIds: groupMembers.map((member) => member.id),
              title: groupTitle.trim(),
            });

      reset();
      onClose();
      await navigate(`/conversations/${conversation.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>New chat</DialogTitle>
      <DialogContent>
        <Stack gap={2.25} pt={0.5}>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={mode}
            onChange={(_, value: ConversationMode | null) => {
              if (value) {
                setMode(value);
              }
            }}
            sx={{
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 0.5,
              "& .MuiToggleButton-root": {
                border: 0,
                borderRadius: 1.5,
                color: "text.secondary",
                fontWeight: 700,
                py: 1,
              },
              "& .Mui-selected": {
                bgcolor: "background.paper",
                boxShadow: "0 1px 3px rgba(17, 24, 39, 0.1)",
                color: "primary.main",
              },
            }}
          >
            <ToggleButton value="direct">
              <Stack alignItems="center" direction="row" gap={1}>
                <MessageCircle fontSize="small" />
                Direct
              </Stack>
            </ToggleButton>
            <ToggleButton value="group">
              <Stack alignItems="center" direction="row" gap={1}>
                <Users fontSize="small" />
                Group
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>

          {mode === "direct" ? (
            <Autocomplete<TeamMember, false, false, false>
              filterSelectedOptions
              getOptionLabel={getMemberLabel}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={membersLoading}
              options={memberOptions}
              value={directMember}
              onChange={(_, value) => setDirectMember(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Member"
                  placeholder="Choose a teammate"
                />
              )}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;

                return (
                  <Box component="li" key={key} {...optionProps}>
                    <Stack alignItems="center" direction="row" gap={1.25}>
                      <ConversationAvatar
                        title={getMemberLabel(option)}
                        type={ConversationType.Direct}
                      />
                      <Stack minWidth={0}>
                        <Typography fontWeight={700} noWrap>
                          {getMemberLabel(option)}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          noWrap
                          variant="caption"
                        >
                          {option.email}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                );
              }}
            />
          ) : (
            <>
              <TextField
                label="Group name"
                placeholder="Design review"
                value={groupTitle}
                onChange={(event) => setGroupTitle(event.target.value)}
              />
              <Autocomplete<TeamMember, true, false, false>
                filterSelectedOptions
                multiple
                getOptionLabel={getMemberLabel}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                loading={membersLoading}
                options={memberOptions}
                value={groupMembers}
                onChange={(_, value) => setGroupMembers(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Members"
                    placeholder="Choose teammates"
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;

                  return (
                    <Box component="li" key={key} {...optionProps}>
                      <Stack alignItems="center" direction="row" gap={1.25}>
                        <ConversationAvatar
                          title={getMemberLabel(option)}
                          type={ConversationType.Direct}
                        />
                        <Stack minWidth={0}>
                          <Typography fontWeight={700} noWrap>
                            {getMemberLabel(option)}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            noWrap
                            variant="caption"
                          >
                            {option.email}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  );
                }}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          disabled={!canSubmit || isSubmitting}
          variant="contained"
          onClick={() => void handleSubmit()}
        >
          {isSubmitting ? "Creating..." : "Create chat"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
