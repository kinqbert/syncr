import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ListConversation, TeamMember } from "@syncr/packages";
import { ConversationType } from "@syncr/packages";
import { MessageCircle, Plus, Users } from "lucide-mui";
import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";

import {
  useCreateDirectConversation,
  useCreateGroupConversation,
} from "@/api/conversations";
import { useGetTeamMembers } from "@/api/team";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getUserFullName } from "@/utils/getUserFullName";

type ConversationsSidebarProps = {
  conversations: ListConversation[];
  loading?: boolean;
};

type ConversationMode = "direct" | "group";

export const CONVERSATIONS_SIDEBAR_HEADER_HEIGHT = 60;

const avatarColors = [
  { bg: "#EEF2FF", color: "#4338CA" },
  { bg: "#ECFDF5", color: "#047857" },
  { bg: "#FFF7ED", color: "#C2410C" },
  { bg: "#EFF6FF", color: "#1D4ED8" },
  { bg: "#FDF2F8", color: "#BE185D" },
];

const getNameInitials = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  return (
    parts
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "?"
  );
};

const getAvatarColor = (value: string) => {
  const seed = value
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return avatarColors[seed % avatarColors.length];
};

const getMemberLabel = (member: TeamMember) =>
  getUserFullName(member.name, member.surname) || member.email;

const ConversationAvatar = ({
  size = 40,
  title,
  type,
}: {
  size?: number;
  title: string;
  type: ListConversation["type"];
}) => {
  const colors = getAvatarColor(title);

  return (
    <Avatar
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        flex: "0 0 auto",
        fontSize: Math.max(12, Math.round(size * 0.35)),
        fontWeight: 800,
        height: size,
        width: size,
      }}
    >
      {type === ConversationType.Group && !title ? (
        <Users fontSize="small" />
      ) : (
        getNameInitials(title)
      )}
    </Avatar>
  );
};

const NewConversationDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
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

export const ConversationsSidebar = ({
  conversations,
  loading = false,
}: ConversationsSidebarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading) {
    return (
      <Stack
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      <Stack
        height="100%"
        width="100%"
        sx={{
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Stack
          sx={{
            minHeight: CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,
            maxHeight: CONVERSATIONS_SIDEBAR_HEADER_HEIGHT,

            px: 2,

            borderBottom: 1,
            borderColor: "divider",

            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={800} variant="h6">
            Chats
          </Typography>
          <Tooltip title="New chat">
            <IconButton
              color="primary"
              size="small"
              onClick={() => setDialogOpen(true)}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                height: 34,
                width: 34,
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              <Plus fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack flex={1} minHeight={0} p={1} sx={{ overflowY: "auto" }}>
          {conversations.length === 0 ? (
            <Stack
              alignItems="center"
              gap={1}
              justifyContent="center"
              px={2}
              py={5}
              textAlign="center"
            >
              <Avatar
                sx={{
                  bgcolor: "#EEF2FF",
                  color: "primary.main",
                  height: 44,
                  width: 44,
                }}
              >
                <MessageCircle fontSize="small" />
              </Avatar>
              <Typography color="text.secondary" variant="body2">
                No chats yet.
              </Typography>
            </Stack>
          ) : (
            conversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                component={NavLink}
                to={`/conversations/${conversation.id}`}
                sx={{
                  mb: 0.5,
                  p: 0,
                  "&.active": {
                    color: "primary.main",
                  },
                  "&.active .MuiListItemButton-root": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                <ListItemButton
                  sx={{
                    borderRadius: 1.5,
                    gap: 1,
                    minHeight: 44,
                    px: 1,
                    py: 0.5,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ConversationAvatar
                    title={conversation.title}
                    type={conversation.type}
                    size={30}
                  />
                  <Stack
                    alignItems="center"
                    direction="row"
                    gap={1}
                    justifyContent="space-between"
                    minWidth={0}
                    width="100%"
                  >
                    <Typography fontSize={14} fontWeight={800} noWrap>
                      {conversation.title || "Untitled chat"}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ textTransform: "capitalize" }}
                      variant="caption"
                    >
                      {conversation.type}
                    </Typography>
                  </Stack>
                </ListItemButton>
              </ListItem>
            ))
          )}
        </Stack>
      </Stack>

      <NewConversationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};
