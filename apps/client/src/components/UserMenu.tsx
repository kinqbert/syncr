import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
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

export const UserMenu = () => {
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
      <IconButton
        aria-controls={isMenuOpen ? "user-menu" : undefined}
        aria-expanded={isMenuOpen ? "true" : undefined}
        aria-haspopup="menu"
        aria-label="Open user menu"
        onClick={(event) => setMenuAnchorEl(event.currentTarget)}
        sx={{
          bgcolor: isMenuOpen ? "action.selected" : "transparent",
          border: 1,
          borderColor: isMenuOpen ? "primary.light" : "divider",
          height: 40,
          width: 40,
          "&:hover": {
            bgcolor: "action.hover",
            borderColor: "primary.light",
          },
        }}
      >
        <UserAvatar
          fallback={<UserRound sx={{ fontSize: 17 }} />}
          name={user?.name}
          size={28}
          surname={user?.surname}
        />
      </IconButton>

      <Menu
        anchorEl={menuAnchorEl}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
        transformOrigin={{ horizontal: "right", vertical: "top" }}
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
