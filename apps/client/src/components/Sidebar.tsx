import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Folders,
  LayoutDashboard,
  MessageCircle,
  PanelLeft,
  Settings,
  Users,
} from "lucide-mui";
import type { ReactNode } from "react";
import { NavLink } from "react-router";

import { useGetNotifications } from "@/api/notifications";
import { useGetMyProjects } from "@/api/projects";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useSidebarStore } from "@/store/useSidebarStore";

import { CompanySwitcher } from "./CompanySwitcher";
import { UserMenu } from "./UserMenu";

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 56;
const MAX_SIDEBAR_PROJECTS = 8;

type NavItem = {
  label: string;
  to: string;
  icon: ReactNode;
  end?: boolean;
};

const PRIMARY_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/", icon: <LayoutDashboard />, end: true },
  { label: "Notifications", to: "/notifications", icon: <Bell /> },
  { label: "Conversations", to: "/conversations", icon: <MessageCircle /> },
  { label: "My calendar", to: "/calendar", icon: <CalendarDays /> },
];

const WORKSPACE_ITEMS: NavItem[] = [
  { label: "Projects", to: "/projects", icon: <Folders />, end: true },
  { label: "Team", to: "/team", icon: <Users /> },
];

type SidebarLinkProps = {
  collapsed: boolean;
  count?: number;
  end?: boolean;
  icon: ReactNode;
  label: string;
  onNavigate: () => void;
  to: string;
};

const SidebarLink = ({
  collapsed,
  count,
  end,
  icon,
  label,
  onNavigate,
  to,
}: SidebarLinkProps) => (
  <Tooltip placement="right" title={collapsed ? label : ""}>
    <Box
      aria-label={collapsed ? label : undefined}
      component={NavLink}
      end={end}
      onClick={onNavigate}
      to={to}
      sx={{
        alignItems: "center",
        borderRadius: 1,
        color: "text.secondary",
        display: "flex",
        gap: 1,
        height: 30,
        justifyContent: collapsed ? "center" : "flex-start",
        px: collapsed ? 0 : 1,
        position: "relative",
        transition: "background-color 120ms ease, color 120ms ease",
        "& .MuiSvgIcon-root": { flexShrink: 0, fontSize: 16 },
        "&:hover": { bgcolor: "surface.hover", color: "text.primary" },
        "&.active": { bgcolor: "surface.active", color: "text.primary" },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: -2,
        },
      }}
    >
      {icon}
      {!collapsed && (
        <Typography noWrap sx={{ flex: 1, fontWeight: 500 }}>
          {label}
        </Typography>
      )}
      {!!count && count > 0 && (
        <Box
          component="span"
          sx={
            collapsed
              ? {
                  bgcolor: "primary.main",
                  border: "2px solid",
                  borderColor: "surface.sidebar",
                  borderRadius: "50%",
                  height: 10,
                  position: "absolute",
                  right: 8,
                  top: 5,
                  width: 10,
                }
              : {
                  color: "text.secondary",
                  fontSize: 12,
                  fontVariantNumeric: "tabular-nums",
                }
          }
        >
          {!collapsed && (count > 99 ? "99+" : count)}
        </Box>
      )}
    </Box>
  </Tooltip>
);

const SidebarGroupLabel = ({
  children,
  collapsed,
  onClick,
  open,
}: {
  children: ReactNode;
  collapsed: boolean;
  onClick?: () => void;
  open?: boolean;
}) =>
  collapsed ? (
    <Box sx={{ borderTop: 1, borderColor: "divider", mx: 1, my: 1 }} />
  ) : (
    <Stack
      alignItems="center"
      component={onClick ? "button" : "div"}
      direction="row"
      gap={0.5}
      onClick={onClick}
      type={onClick ? "button" : undefined}
      sx={{
        bgcolor: "transparent",
        border: 0,
        borderRadius: 1,
        color: "text.secondary",
        cursor: onClick ? "pointer" : "default",
        font: "inherit",
        mt: 1.5,
        mb: 0.25,
        px: 1,
        py: 0.25,
        textAlign: "left",
        width: "100%",
        "&:hover": onClick ? { color: "text.primary" } : undefined,
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{children}</Typography>
      {onClick && (
        <ChevronRight
          sx={{
            fontSize: 12,
            transform: open ? "rotate(90deg)" : "none",
            transition: "transform 120ms ease",
          }}
        />
      )}
    </Stack>
  );

const SidebarProjects = ({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate: () => void;
}) => {
  const isProjectsOpen = useSidebarStore((state) => state.isProjectsOpen);
  const toggleProjects = useSidebarStore((state) => state.toggleProjects);
  const { data: projects = [] } = useGetMyProjects();

  if (collapsed || projects.length === 0) {
    return null;
  }

  const visibleProjects = projects
    .filter((project) => project.status !== "archived")
    .slice(0, MAX_SIDEBAR_PROJECTS);

  return (
    <>
      <SidebarGroupLabel
        collapsed={collapsed}
        onClick={toggleProjects}
        open={isProjectsOpen}
      >
        Your projects
      </SidebarGroupLabel>
      <Collapse in={isProjectsOpen}>
        <Stack gap={0.25}>
          {visibleProjects.map((project) => (
            <SidebarLink
              collapsed={false}
              icon={
                <Box
                  sx={{
                    bgcolor: `projectStatus.${project.status}`,
                    borderRadius: 0.5,
                    flexShrink: 0,
                    height: 8,
                    mx: "4px",
                    width: 8,
                  }}
                />
              }
              key={project.id}
              label={project.name}
              onNavigate={onNavigate}
              to={`/projects/${project.id}`}
            />
          ))}
        </Stack>
      </Collapse>
    </>
  );
};

const SidebarContent = ({ collapsed }: { collapsed: boolean }) => {
  const isMobile = useIsMobile();
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);
  const hasCompany = useCompanyStore((state) => state.selectedCompanyId !== null);
  const { data: notifications = [] } = useGetNotifications();
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleNavigate = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <Stack height="100%" minHeight={0}>
      <Stack
        alignItems="center"
        direction={collapsed ? "column" : "row"}
        gap={0.5}
        sx={{ p: 1, pb: 0.5 }}
      >
        <Box flex={collapsed ? "none" : 1} minWidth={0}>
          <CompanySwitcher collapsed={collapsed} />
        </Box>
        {!isMobile && (
          <Tooltip
            placement="right"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconButton
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={toggleSidebar}
              size="small"
            >
              <PanelLeft />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Stack
        component="nav"
        aria-label="Main"
        gap={0.25}
        sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 1, py: 0.5 }}
      >
        {hasCompany && (
          <>
            {PRIMARY_ITEMS.map((item) => (
              <SidebarLink
                {...item}
                collapsed={collapsed}
                count={item.to === "/notifications" ? unreadCount : undefined}
                key={item.to}
                onNavigate={handleNavigate}
              />
            ))}

            <SidebarGroupLabel collapsed={collapsed}>Workspace</SidebarGroupLabel>
            {WORKSPACE_ITEMS.map((item) => (
              <SidebarLink
                {...item}
                collapsed={collapsed}
                key={item.to}
                onNavigate={handleNavigate}
              />
            ))}

            <SidebarProjects collapsed={collapsed} onNavigate={handleNavigate} />
          </>
        )}
      </Stack>

      <Stack gap={0.25} sx={{ borderTop: 1, borderColor: "divider", p: 1 }}>
        {hasCompany && (
          <SidebarLink
            collapsed={collapsed}
            icon={<Settings />}
            label="Settings"
            onNavigate={handleNavigate}
            to="/settings"
          />
        )}
        <UserMenu collapsed={collapsed} />
      </Stack>
    </Stack>
  );
};

export const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const isMobileOpen = useSidebarStore((state) => state.isMobileOpen);
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer
        onClose={() => setMobileOpen(false)}
        open={isMobileOpen}
        variant="temporary"
        slotProps={{ paper: { sx: { width: SIDEBAR_WIDTH } } }}
      >
        <SidebarContent collapsed={false} />
      </Drawer>
    );
  }

  const width = isOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box
      component="aside"
      sx={{
        bgcolor: "surface.sidebar",
        borderRight: 1,
        borderColor: "divider",
        flexShrink: 0,
        height: "100%",
        overflow: "hidden",
        transition: "width 180ms ease",
        width,
      }}
    >
      <SidebarContent collapsed={!isOpen} />
    </Box>
  );
};
