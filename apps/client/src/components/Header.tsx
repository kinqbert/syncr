import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { CompanySwitcher } from "./CompanySwitcher";
import { useSidebarStore } from "@/store/useSidebarStore";

import MenuIcon from "@mui/icons-material/Menu";

export const HEADER_HEIGHT = 64;

export const Header = () => {
  const toggleSidebar = useSidebarStore((state) => state.toggleIsOpen);

  return (
    <AppBar
      color="default"
      elevation={1}
      position="sticky"
      sx={{ height: HEADER_HEIGHT }}
    >
      <Toolbar sx={{ gap: 2, justifyContent: "start" }}>
        <IconButton onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Syncr</Typography>

        <CompanySwitcher />
      </Toolbar>
    </AppBar>
  );
};
