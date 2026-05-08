import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";
import { FolderKanban } from "lucide-mui";

import { theme } from "@/lib/theme";
import { useSidebarStore } from "@/store/useSidebarStore";

import { CompanySwitcher } from "./CompanySwitcher";
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from "./Sidebar";
import { UserMenu } from "./UserMenu";

export const HEADER_HEIGHT = 64;

export const Header = () => {
  const open = useSidebarStore((state) => state.isOpen);

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
            sx={{
              width: 32,
              minWidth: 32,
              minHeight: 32,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "primary.contrastText",
              bgcolor: "primary.main",
              borderRadius: 2,
            }}
          >
            <FolderKanban sx={{ fontSize: 20 }} />
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
