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

const fade = (visible: boolean) => ({
  opacity: visible ? 1 : 0,
  transition: "opacity 150ms ease",
});

const SidebarLink = ({
  collapsed,
  count,
  end,
  icon,
  label,
  onNavigate,
  to,
}: SidebarLinkProps) => {
  const hasCount = !!count && count > 0;

  return (
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
          flexShrink: 0,
          gap: 1,
          height: 30,
          overflow: "hidden",
          // Fixed padding keeps the icon in the same spot when collapsed.
          px: "12px",
          position: "relative",
          transition: "background-color 120ms ease, color 120ms ease",
          whiteSpace: "nowrap",
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
        <Typography noWrap sx={{ flex: 1, fontWeight: 500, ...fade(!collapsed) }}>
          {label}
        </Typography>
        {hasCount && (
          <>
            <Box
              component="span"
              sx={{
                color: "text.secondary",
                fontSize: 12,
                fontVariantNumeric: "tabular-nums",
                ...fade(!collapsed),
              }}
            >
              {count > 99 ? "99+" : count}
            </Box>
            <Box
              component="span"
              sx={{
                bgcolor: "primary.main",
                border: "2px solid",
                borderColor: "surface.sidebar",
                borderRadius: "50%",
                height: 10,
                left: 26,
                position: "absolute",
                top: 4,
                width: 10,
                ...fade(collapsed),
              }}
            />
          </>
        )}
      </Box>
    </Tooltip>
  );
};

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
}) => (
  <Stack
    alignItems="center"
    component={onClick ? "button" : "div"}
    direction="row"
    disabled={onClick ? collapsed : undefined}
    gap={0.5}
    onClick={onClick}
    tabIndex={collapsed ? -1 : undefined}
    type={onClick ? "button" : undefined}
    sx={{
      bgcolor: "transparent",
      border: 0,
      borderRadius: 1,
      color: "text.secondary",
      cursor: onClick && !collapsed ? "pointer" : "default",
      flexShrink: 0,
      font: "inherit",
      height: 24,
      mt: 1.5,
      overflow: "hidden",
      px: "12px",
      textAlign: "left",
      whiteSpace: "nowrap",
      width: "100%",
      ...fade(!collapsed),
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

  if (projects.length === 0) {
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
              collapsed={collapsed}
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
  const openSidebar = useSidebarStore((state) => state.openSidebar);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);
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
      <Box sx={{ p: 1, pb: 0.5, position: "relative" }}>
        <Box sx={{ pr: collapsed || isMobile ? 0 : 4 }}>
          <CompanySwitcher collapsed={collapsed} onExpand={openSidebar} />
        </Box>
        {!isMobile && (
          <Tooltip title="Collapse sidebar">
            <IconButton
              aria-hidden={collapsed}
              aria-label="Collapse sidebar"
              onClick={closeSidebar}
              size="small"
              tabIndex={collapsed ? -1 : undefined}
              sx={{
                pointerEvents: collapsed ? "none" : "auto",
                position: "absolute",
                right: 8,
                top: 12,
                ...fade(!collapsed),
              }}
            >
              <PanelLeft />
            </IconButton>
          </Tooltip>
        )}
      </Box>

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

      <Box sx={{ borderTop: 1, borderColor: "divider", p: 1 }}>
        <UserMenu collapsed={collapsed} />
      </Box>
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
        transition: "width 200ms cubic-bezier(0.2, 0, 0, 1)",
        width,
      }}
    >
      <SidebarContent collapsed={!isOpen} />
    </Box>
  );
};
