import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import { AppBar, Stack, Toolbar, Typography } from "@mui/material";

import { theme } from "@/lib/theme";
import { useSidebarStore } from "@/store/useSidebarStore";

import { CompanySwitcher } from "./CompanySwitcher";
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from "./Sidebar";

export const HEADER_HEIGHT = 64;

export const Header = () => {
  const open = useSidebarStore((state) => state.isOpen);

  return (
    <AppBar
      color="default"
      elevation={1}
      position="sticky"
      sx={{
        height: HEADER_HEIGHT,
        backgroundColor: "background.paper",
        p: 0,
      }}
    >
      <Toolbar disableGutters>
        <Stack
          height="100%"
          width={open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH}
          direction="row"
          alignItems="center"
          gap={1}
          borderRight={1}
          borderColor="divider"
          boxSizing="border-box"
          px={1.75}
          sx={{
            transition: theme.transitions.create("width", {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.sharp,
            }),
          }}
        >
          <ViewKanbanIcon fontSize="large" color="primary" />
          <Typography
            variant="h6"
            color="primary"
            noWrap
            sx={{
              maxWidth: open ? 80 : 0,
              opacity: open ? 1 : 0,
              overflow: "hidden",
              transition: "max-width 220ms ease, opacity 180ms ease",
            }}
          >
            Syncr
          </Typography>
        </Stack>

        <Stack px={2}>
          <CompanySwitcher />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
