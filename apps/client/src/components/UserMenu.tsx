import {
  Box,
  Divider,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useColorScheme,
} from "@mui/material";
import {
  Info,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
  UserRound,
} from "lucide-mui";
import { useState } from "react";
import { useNavigate } from "react-router";

import { useLogout, useMe } from "@/api";
import { useGetMyCompanies } from "@/api/companies";
import { queryClient } from "@/lib/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useCompanyStore } from "@/store/useCompanyStore";
import { getUserFullName } from "@/utils/getUserFullName";

import { UserAvatar } from "./UserAvatar";

const COLOR_MODES = [
  { value: "light", label: "Light", icon: <Sun /> },
  { value: "dark", label: "Dark", icon: <Moon /> },
  { value: "system", label: "System", icon: <Monitor /> },
] as const;

type ColorMode = (typeof COLOR_MODES)[number]["value"];

type UserMenuProps = {
  /** Avatar-only trigger for the collapsed sidebar. */
  collapsed?: boolean;
  /** Avatar-only trigger for compact top bars. */
  variant?: "row" | "icon";
};

export const UserMenu = ({ collapsed = false, variant = "row" }: UserMenuProps) => {
  const iconOnly = collapsed || variant === "icon";
  const navigate = useNavigate();
  const logout = useLogout();
  const clearUser = useAuthStore((state) => state.clearUser);
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const clearSelectedCompany = useCompanyStore(
    (state) => state.clearSelectedCompany,
  );
  const { data: user } = useMe();
  const { data: companies = [] } = useGetMyCompanies();
  const { mode, setMode } = useColorScheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const selectedCompany = companies.find(
    (company) => company.id === selectedCompanyId,
  );
  const fullName = user ? getUserFullName(user.name, user.surname) : "User";

  const closeMenu = () => setMenuAnchorEl(null);

  const handleOpenSettings = () => {
    closeMenu();
    navigate("/settings");
  };

  const handleOpenAbout = () => {
    closeMenu();
    navigate("/about");
  };

  const handleLogout = async () => {
    closeMenu();

    try {
      await logout.mutateAsync();
    } finally {
      clearUser();
      clearSelectedCompany();
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <Tooltip placement="right" title={collapsed ? fullName : ""}>
        <Box
          aria-controls={isMenuOpen ? "user-menu" : undefined}
          aria-expanded={isMenuOpen ? "true" : undefined}
          aria-haspopup="menu"
          aria-label="Open user menu"
          component="button"
          onClick={(event) => setMenuAnchorEl(event.currentTarget)}
          type="button"
          sx={{
            alignItems: "center",
            bgcolor: isMenuOpen ? "surface.active" : "transparent",
            border: 0,
            borderRadius: 1,
            color: "text.primary",
            cursor: "pointer",
            display: "flex",
            font: "inherit",
            gap: 1,
            height: iconOnly ? 32 : 36,
            justifyContent: iconOnly ? "center" : "flex-start",
            minWidth: 0,
            px: iconOnly ? 0.5 : 0.75,
            textAlign: "left",
            transition: "background-color 120ms ease",
            width: iconOnly ? "auto" : "100%",
            "&:hover": { bgcolor: "surface.hover" },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
            },
          }}
        >
          <UserAvatar
            fallback={<UserRound sx={{ fontSize: 14 }} />}
            name={user?.name}
            size={22}
            surname={user?.surname}
          />
          {!iconOnly && (
            <Stack flex={1} minWidth={0}>
              <Typography noWrap sx={{ fontWeight: 500, lineHeight: 1.3 }}>
                {fullName}
              </Typography>
            </Stack>
          )}
        </Box>
      </Tooltip>

      <Menu
        anchorEl={menuAnchorEl}
        anchorOrigin={
          variant === "icon"
            ? { horizontal: "right", vertical: "bottom" }
            : { horizontal: "left", vertical: "top" }
        }
        id="user-menu"
        onClose={closeMenu}
        open={isMenuOpen}
        slotProps={{
          paper: {
            sx: { width: 220 },
          },
          list: {
            "aria-label": "User menu",
            dense: true,
            sx: {
              p: 0,
              "& .MuiMenuItem-root + .MuiDivider-root": {
                my: 0,
              },
            },
          },
        }}
        transformOrigin={
          variant === "icon"
            ? { horizontal: "right", vertical: "top" }
            : { horizontal: "left", vertical: "bottom" }
        }
      >
        <Stack gap={0.25} sx={{ px: 1.75, py: 1.25 }}>
          <Typography
            noWrap
            sx={{ color: "text.primary", fontSize: 13, fontWeight: 600 }}
          >
            {fullName}
          </Typography>
          <Typography noWrap sx={{ color: "text.secondary", fontSize: 12 }}>
            {user?.email ?? ""}
          </Typography>
          {selectedCompany?.roleName && (
            <Typography noWrap sx={{ color: "primary.main", fontSize: 12 }}>
              {selectedCompany.roleName}
            </Typography>
          )}
        </Stack>

        <Divider sx={{ m: 0 }} />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ px: 1.75, py: 1 }}
        >
          <Typography color="text.secondary" variant="body2">
            Theme
          </Typography>
          <ToggleButtonGroup
            exclusive
            aria-label="Color theme"
            onChange={(_, value: ColorMode | null) => {
              if (value) setMode(value);
            }}
            size="small"
            value={mode ?? "system"}
            sx={{
              bgcolor: "surface.subtle",
              borderRadius: 1,
              p: 0.25,
              "& .MuiToggleButton-root": {
                border: 0,
                borderRadius: 0.75,
                color: "text.secondary",
                p: 0.5,
                "& .MuiSvgIcon-root": { fontSize: 15 },
              },
              "& .MuiToggleButton-root.Mui-selected": {
                bgcolor: "surface.active",
                boxShadow: "var(--mui-palette-elevation-card)",
                color: "text.primary",
              },
            }}
          >
            {COLOR_MODES.map((item) => (
              <ToggleButton
                aria-label={item.label}
                key={item.value}
                title={item.label}
                value={item.value}
              >
                {item.icon}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Divider sx={{ m: 0 }} />
        <MenuItem
          onClick={handleOpenAbout}
          sx={{
            gap: 1,
            minHeight: 36,
            px: 1.75,
          }}
        >
          <Info sx={{ color: "text.secondary", fontSize: 16 }} />
          <Typography sx={{ fontSize: 13, lineHeight: 0 }}>
            About Syncr
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={handleOpenSettings}
          sx={{
            gap: 1,
            minHeight: 36,
            px: 1.75,
          }}
        >
          <Settings sx={{ color: "text.secondary", fontSize: 16 }} />
          <Typography sx={{ fontSize: 13, lineHeight: 0 }}>Settings</Typography>
        </MenuItem>

        <Divider sx={{ m: 0 }} />
        <MenuItem
          disabled={logout.isPending}
          onClick={() => void handleLogout()}
          sx={{
            color: "error.main",
            gap: 1,
            minHeight: 40,
            px: 1.75,
          }}
        >
          <LogOut sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
