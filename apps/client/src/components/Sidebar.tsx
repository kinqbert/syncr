import { useSidebarStore } from "@/store/useSidebarStore";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  type Theme,
} from "@mui/material";
import { HEADER_HEIGHT } from "./Header";
import { NavLink } from "react-router";

import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import CasesIcon from "@mui/icons-material/Cases";

const SIDEBAR_WIDTH = 240;

const SIDEBAR_ITEMS: {
  id: number;
  label: string;
  to: string;
  icon: React.ReactNode;
}[] = [
  { id: 0, label: "Dashboard", to: "/", icon: <SpaceDashboardIcon /> },
  { id: 1, label: "Projects", to: "projects", icon: <CasesIcon /> },
];

export const Sidebar = () => {
  const open = useSidebarStore((state) => state.isOpen);

  return (
    <Drawer
      open={open}
      variant="persistent"
      sx={(theme: Theme) => ({
        width: open ? SIDEBAR_WIDTH : 0,
        flexShrink: 0,
        transition: theme.transitions.create("width", {
          duration: theme.transitions.duration.enteringScreen,
          easing: theme.transitions.easing.sharp,
        }),
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          top: { xs: 56, sm: HEADER_HEIGHT },
          height: {
            xs: "calc(100% - 56px)",
            sm: `calc(100% - ${HEADER_HEIGHT}px)`,
          },
        },
      })}
    >
      <List disablePadding>
        {SIDEBAR_ITEMS.map((item) => (
          <ListItem
            key={item.id}
            disablePadding
            component={NavLink}
            to={item.to}
            sx={{
              "&.active": {
                bgcolor: "action.selected",
                color: "primary.main",
              },
              "&.active .MuiListItemIcon-root": {
                color: "primary.main",
              },
            }}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
