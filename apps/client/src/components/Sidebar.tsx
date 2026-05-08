import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  type Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Folders,
  LayoutDashboard,
  Users,
} from "lucide-mui";
import { NavLink } from "react-router";

import { useGetNotifications } from "@/api/notifications";
import { theme } from "@/lib/theme";
import { useSidebarStore } from "@/store/useSidebarStore";

import { HEADER_HEIGHT } from "./Header";

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 65;

const SIDEBAR_ITEMS: {
  id: number;
  label: string;
  to: string;
  icon: React.ReactNode;
}[] = [
  { id: 0, label: "Dashboard", to: "/", icon: <LayoutDashboard /> },
  { id: 1, label: "Projects", to: "projects", icon: <Folders /> },
  {
    id: 3,
    label: "Team",
    to: "team",
    icon: <Users />,
  },
  {
    id: 2,
    label: "Notifications",
    to: "notifications",
    icon: <Bell />,
  },
];

export const Sidebar = () => {
  const open = useSidebarStore((state) => state.isOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleIsOpen);
  const { data: notifications = [] } = useGetNotifications();

  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <Box position="relative">
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
            top: HEADER_HEIGHT,
            height: {
              xs: "calc(100% - 56px)",
              sm: `calc(100% - ${HEADER_HEIGHT}px)`,
            },
            borderRightColor: "divider",
            transition: theme.transitions.create("width", {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.sharp,
            }),
          },
        })}
      >
        <List
          disablePadding
          sx={{
            flex: 1,
            px: 1.75,
            pt: 1.5,
          }}
        >
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
                  mb: 0.75,
                  overflowX: "hidden",
                  "&.active": {
                    color: "primary.main",
                  },
                  "&.active .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                  "&.active .MuiListItemButton-root": {
                    bgcolor: "#EEF2FF",
                    color: "primary.main",
                  },
                  "&.active .MuiListItemButton-root:hover": {
                    bgcolor: "#EEF2FF",
                  },
                }}
              >
                <ListItemButton
                  sx={{
                    borderRadius: 1,
                    color: "text.secondary",
                    gap: open ? 1.25 : 0,
                    minHeight: 32,
                    justifyContent: "initial",
                    p: 1,
                    transition:
                      "background-color 160ms ease, color 160ms ease, gap 220ms ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      flexShrink: 0,
                      color: "text.secondary",
                      justifyContent: "center",
                      minWidth: 0,
                      "& .MuiSvgIcon-root": {
                        fontSize: 20,
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 500,
                        lineHeight: "20px",
                        noWrap: true,
                      }}
                      sx={{
                        flex: open ? "1 1 auto" : "0 1 auto",
                        m: 0,
                        maxWidth: open ? 150 : 0,
                        opacity: open ? 1 : 0,
                        overflow: "hidden",
                        transition:
                          "max-width 220ms ease, opacity 180ms ease, flex-basis 220ms ease",
                        whiteSpace: "nowrap",
                      }}
                    />
                    {item.label === "Notifications" &&
                      unreadNotificationsCount > 0 && (
                        <Box
                          component="span"
                          sx={{
                            alignItems: "center",
                            bgcolor: "primary.main",
                            borderRadius: 999,
                            color: "primary.contrastText",
                            display: "inline-flex",
                            flex: "0 0 auto",
                            height: 18,
                            justifyContent: "center",
                            maxWidth: open ? 40 : 0,
                            minWidth: open ? 18 : 0,
                            opacity: open ? 1 : 0,
                            overflow: "hidden",
                            pointerEvents: open ? "auto" : "none",
                            px: open ? 0.5 : 0,
                            transform: open ? "scale(1)" : "scale(0.8)",
                            transformOrigin: "right center",
                            transition:
                              "max-width 220ms ease, opacity 180ms ease, transform 180ms ease",
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              lineHeight: 1,
                            }}
                          >
                            {unreadNotificationsCount > 99
                              ? "99+"
                              : unreadNotificationsCount}
                          </Typography>
                        </Box>
                      )}
                  </>
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>
      <Tooltip title={open ? "Collapse sidebar" : "Expand sidebar"}>
        <Button
          disableRipple
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          onClick={toggleSidebar}
          color="info"
          sx={{
            width: 32,
            height: 32,

            minWidth: 32,
            maxWidth: 32,

            p: 0,

            zIndex: theme.zIndex.drawer + 1,

            position: "absolute",
            right: -16,
            top: "50%",

            border: 1,
            borderColor: "divider",
            borderRadius: 100,

            bgcolor: "background.paper",
          }}
        >
          {open ? (
            <ChevronLeft sx={{ fontSize: 20 }} />
          ) : (
            <ChevronRight sx={{ fontSize: 20 }} />
          )}
        </Button>
      </Tooltip>
    </Box>
  );
};
