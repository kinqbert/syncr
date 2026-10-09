import { IconButton, Link, Stack, Typography } from "@mui/material";
import { ArrowUpRight, Menu } from "lucide-mui";

import { getRealWebsiteUrl } from "@/lib/demo";
import { useSidebarStore } from "@/store/useSidebarStore";

import { UserMenu } from "./UserMenu";

export const DemoBanner = () => (
  <Stack
    alignItems="center"
    direction="row"
    gap={0.75}
    justifyContent="center"
    sx={{
      bgcolor: "accent.soft",
      color: "accent.text",
      flexShrink: 0,
      minHeight: 28,
      px: 2,
      py: 0.5,
    }}
  >
    <Typography noWrap variant="body2">
      You're exploring a demo workspace.
    </Typography>
    <Link
      color="inherit"
      href={getRealWebsiteUrl()}
      rel="noreferrer"
      target="_blank"
      underline="hover"
      variant="body2"
      sx={{
        alignItems: "center",
        display: "inline-flex",
        fontWeight: 600,
        gap: 0.25,
        whiteSpace: "nowrap",
      }}
    >
      Visit the real website
      <ArrowUpRight sx={{ fontSize: 14 }} />
    </Link>
  </Stack>
);

export const MobileTopBar = () => {
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  return (
    <Stack
      alignItems="center"
      component="header"
      direction="row"
      gap={1}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        flexShrink: 0,
        height: 48,
        px: 1,
      }}
    >
      <IconButton aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
        <Menu />
      </IconButton>
      <Typography flex={1} fontWeight={600} variant="subtitle1">
        Syncr
      </Typography>
      <UserMenu variant="icon" />
    </Stack>
  );
};
