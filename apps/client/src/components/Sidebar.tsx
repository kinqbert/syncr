import CasesIcon from "@mui/icons-material/Cases";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  type Theme,
  Tooltip,
} from "@mui/material";
import { NavLink } from "react-router";

import { useSidebarStore } from "@/store/useSidebarStore";

import { HEADER_HEIGHT } from "./Header";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 64;

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
  const toggleSidebar = useSidebarStore((state) => state.toggleIsOpen);

  return (
    <Drawer
      variant="permanent"
      sx={(theme: Theme) => ({
        width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
        flexShrink: 0,
        transition: theme.transitions.create("width", {
          duration: theme.transitions.duration.enteringScreen,
          easing: theme.transitions.easing.sharp,
        }),
        "& .MuiDrawer-paper": {
          width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          top: { xs: 56, sm: HEADER_HEIGHT },
          height: {
            xs: "calc(100% - 56px)",
            sm: `calc(100% - ${HEADER_HEIGHT}px)`,
          },
          transition: theme.transitions.create("width", {
            duration: theme.transitions.duration.enteringScreen,
            easing: theme.transitions.easing.sharp,
          }),
        },
      })}
    >
      <List disablePadding sx={{ flex: 1 }}>
        {SIDEBAR_ITEMS.map((item) => (
          <Tooltip
            key={item.id}
            title={open ? "" : item.label}
            placement="right"
          >
            <ListItem
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
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open ? 40 : 0,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
      <List disablePadding>
        <ListItem disablePadding>
          <Tooltip title={open ? "Collapse sidebar" : "Expand sidebar"}>
            <IconButton
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
              onClick={toggleSidebar}
              sx={{
                mx: "auto",
                my: 1,
              }}
            >
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
};
