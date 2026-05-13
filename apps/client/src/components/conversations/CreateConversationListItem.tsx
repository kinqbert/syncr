import {
  Avatar,
  ListItem,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Plus } from "lucide-mui";

type CreateConversationListItemProps = {
  onClick: () => void;
  open: boolean;
};

export const CreateConversationListItem = ({
  onClick,
  open,
}: CreateConversationListItemProps) => {
  return (
    <Tooltip title={open ? "" : "Create new chat"} placement="right">
      <ListItem
        sx={{
          mb: 0.5,
          overflowX: "hidden",
          p: 0,
        }}
      >
        <ListItemButton
          onClick={onClick}
          sx={{
            borderRadius: 1.5,
            gap: open ? 1 : 0,
            justifyContent: "initial",
            minHeight: 44,
            px: 1,
            py: 0.5,
            transition:
              "background-color 160ms ease, color 160ms ease, gap 220ms ease",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              flex: "0 0 auto",
              height: 32,
              width: 32,
            }}
          >
            <Plus fontSize="small" />
          </Avatar>
          <Stack
            alignItems="center"
            direction="row"
            minWidth={0}
            sx={{
              flex: open ? "1 1 auto" : "0 1 auto",
              maxWidth: open ? 220 : 0,
              opacity: open ? 1 : 0,
              overflow: "hidden",
              transition:
                "max-width 220ms ease, opacity 180ms ease, flex-basis 220ms ease",
            }}
            width="100%"
          >
            <Typography fontSize={14} fontWeight={800} noWrap>
              Create new chat
            </Typography>
          </Stack>
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};
