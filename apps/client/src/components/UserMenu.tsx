import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { LogOut, Settings, UserRound } from "lucide-mui";
import { useState } from "react";
import { useNavigate } from "react-router";

import { useLogout, useMe } from "@/api";
import { useGetMyCompanies } from "@/api/companies";
import { queryClient } from "@/lib/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useCompanyStore } from "@/store/useCompanyStore";
import { getUserFullName } from "@/utils/getUserFullName";

import { UserAvatar } from "./UserAvatar";

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
            elevation: 3,
            sx: {
              border: 1,
              borderColor: "divider",
              borderRadius: 1.25,
              boxShadow: "0 10px 24px rgba(17, 24, 39, 0.14)",
              mt: 0.75,
              overflow: "hidden",
              width: 180,
            },
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
        <MenuItem
          onClick={handleOpenSettings}
          sx={{
            gap: 1,
            minHeight: 36,
            px: 1.75,
          }}
        >
          <Settings sx={{ color: "text.secondary", fontSize: 16 }} />
          <Typography sx={{ fontSize: 13 }}>Settings</Typography>
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
