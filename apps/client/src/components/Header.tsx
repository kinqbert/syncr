import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { FolderKanban, PanelLeftClose, PanelLeftOpen } from "lucide-mui";

import { theme } from "@/lib/theme";
import { useSidebarStore } from "@/store/useSidebarStore";

import { CompanySwitcher } from "./CompanySwitcher";
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from "./Sidebar";
import { UserMenu } from "./UserMenu";

export const HEADER_HEIGHT = 64;

export const Header = () => {
  const open = useSidebarStore((state) => state.isOpen);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);
  const openSidebar = useSidebarStore((state) => state.openSidebar);

  return (
    <AppBar
      color="default"
      elevation={0}
      position="sticky"
      sx={{
        height: HEADER_HEIGHT,
        backgroundColor: "background.paper",
        p: 0,

        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          height: HEADER_HEIGHT,
          minHeight: {
            xs: HEADER_HEIGHT,
            sm: HEADER_HEIGHT,
          },
        }}
      >
        <Stack
          height="100%"
          width={open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH}
          direction="row"
          alignItems="center"
          gap={1}
          borderRight={1}
          borderColor="divider"
          boxSizing="border-box"
          px={2}
          sx={{
            transition: theme.transitions.create("width", {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.sharp,
            }),
          }}
        >
          <Box
            onClick={() => {
              if (!open) {
                openSidebar();
              }
            }}
            aria-label={open ? undefined : "Expand sidebar"}
            role={open ? undefined : "button"}
            tabIndex={open ? undefined : 0}
            onKeyDown={(event) => {
              if (!open && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                openSidebar();
              }
            }}
            sx={{
              width: 32,
              minWidth: 32,
              minHeight: 32,
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "primary.contrastText",
              bgcolor: "primary.main",
              borderRadius: 2,
              cursor: open ? "default" : "pointer",
              overflow: "hidden",
              "& .brand-icon": {
                opacity: 1,
                position: "absolute",
                transform: "scale(1)",
                transition: "opacity 150ms ease, transform 150ms ease",
              },
              "& .sidebar-open-icon": {
                opacity: 0,
                position: "absolute",
                transform: "scale(0.9)",
                transition: "opacity 150ms ease, transform 150ms ease",
              },
              "&:hover .brand-icon": {
                opacity: open ? 1 : 0,
                transform: open ? "scale(1)" : "scale(0.9)",
              },
              "&:hover .sidebar-open-icon": {
                opacity: open ? 0 : 1,
                transform: "scale(1)",
              },
            }}
          >
            <FolderKanban className="brand-icon" sx={{ fontSize: 20 }} />
            <PanelLeftOpen
              className="sidebar-open-icon"
              sx={{ fontSize: 20 }}
            />
          </Box>
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
          <Tooltip title="Collapse sidebar">
            <IconButton
              aria-label="Collapse sidebar"
              onClick={closeSidebar}
              size="small"
              sx={{
                color: "text.secondary",
                height: 32,
                ml: "auto",
                maxWidth: open ? 32 : 0,
                minWidth: 0,
                opacity: open ? 1 : 0,
                overflow: "hidden",
                pointerEvents: open ? "auto" : "none",
                transform: open ? "scale(1)" : "scale(0.92)",
                transition:
                  "max-width 220ms ease, opacity 180ms ease, transform 180ms ease, color 160ms ease, background-color 160ms ease",
                width: 32,
                "&:hover": {
                  bgcolor: "action.hover",
                  color: "text.primary",
                },
              }}
            >
              <PanelLeftClose sx={{ fontSize: 19 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flex={1}
          minWidth={0}
          px={2}
        >
          <CompanySwitcher />
          <UserMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
