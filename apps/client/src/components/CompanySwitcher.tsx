import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Check, ChevronDown, PanelLeft, Plus } from "lucide-mui";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";

import { useCreateCompany, useGetMyCompanies } from "@/api/companies";
import { removeCompanyScopedCache } from "@/lib/react-query";
import { useCompanyStore } from "@/store/useCompanyStore";
import { getErrorMessage } from "@/utils/getErrorMessage";

const WorkspaceLogo = ({ name, size = 22 }: { name: string; size?: number }) => (
  <Box
    aria-hidden
    sx={{
      alignItems: "center",
      bgcolor: "primary.main",
      borderRadius: 1,
      color: "primary.contrastText",
      display: "inline-flex",
      flexShrink: 0,
      fontSize: Math.round(size * 0.5),
      fontWeight: 700,
      height: size,
      justifyContent: "center",
      width: size,
    }}
  >
    {name.trim().charAt(0).toUpperCase() || "S"}
  </Box>
);

type CompanySwitcherProps = {
  /** In the collapsed sidebar the trigger expands the sidebar instead. */
  collapsed?: boolean;
  onExpand?: () => void;
};

export const CompanySwitcher = ({
  collapsed = false,
  onExpand,
}: CompanySwitcherProps) => {
  const navigate = useNavigate();

  const { data: companies = [], isPending } = useGetMyCompanies();
  const createCompany = useCreateCompany();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const setSelectedCompanyId = useCompanyStore(
    (state) => state.setSelectedCompanyId,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleCompanyChange = (nextCompanyId: number) => {
    if (nextCompanyId === selectedCompanyId) {
      setMenuAnchorEl(null);
      return;
    }

    navigate("/");

    setSelectedCompanyId(nextCompanyId);
    removeCompanyScopedCache();
    setMenuAnchorEl(null);
  };

  const handleOpenCreateDialog = () => {
    setMenuAnchorEl(null);
    setIsCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    if (createCompany.isPending) {
      return;
    }

    setIsCreateDialogOpen(false);
    setCompanyName("");
    setCreateError(null);
  };

  const handleCreateCompany = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedCompanyName = companyName.trim();

    if (!trimmedCompanyName) {
      setCreateError("Company name is required.");
      return;
    }

    setCreateError(null);

    try {
      const company = await createCompany.mutateAsync({
        name: trimmedCompanyName,
      });

      navigate("/");

      setSelectedCompanyId(company.id);
      removeCompanyScopedCache();
      handleCreateDialogClose();
    } catch (error) {
      setCreateError(getErrorMessage(error, "Could not create company."));
    }
  };

  const selectedCompany = companies.find(
    (company) => company.id === selectedCompanyId,
  );
  const workspaceName = selectedCompany?.name ?? "Select workspace";

  return (
    <>
      <Tooltip placement="right" title={collapsed ? "Expand sidebar" : ""}>
        <Box
          aria-controls={isMenuOpen ? "company-switcher-menu" : undefined}
          aria-expanded={isMenuOpen ? "true" : undefined}
          aria-haspopup={collapsed ? undefined : "menu"}
          aria-label={collapsed ? "Expand sidebar" : undefined}
          component="button"
          disabled={isPending && !collapsed}
          onClick={(event) =>
            collapsed ? onExpand?.() : setMenuAnchorEl(event.currentTarget)
          }
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
            height: 36,
            minWidth: 0,
            overflow: "hidden",
            px: "9px",
            textAlign: "left",
            transition: "background-color 120ms ease",
            width: "100%",
            "&:hover": { bgcolor: "surface.hover" },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
            },
            // Collapsed: the logo turns into a sidebar icon on hover.
            ...(collapsed && {
              "&:hover .workspace-logo": { opacity: 0 },
              "&:hover .workspace-expand": { opacity: 1 },
            }),
          }}
        >
          <Box sx={{ flexShrink: 0, height: 22, position: "relative", width: 22 }}>
            <Box className="workspace-logo" sx={{ transition: "opacity 120ms ease" }}>
              <WorkspaceLogo name={workspaceName} />
            </Box>
            <Box
              aria-hidden
              className="workspace-expand"
              sx={{
                alignItems: "center",
                color: "text.secondary",
                display: "flex",
                inset: 0,
                justifyContent: "center",
                opacity: 0,
                position: "absolute",
                transition: "opacity 120ms ease",
              }}
            >
              <PanelLeft sx={{ fontSize: 18 }} />
            </Box>
          </Box>
          <Typography
            noWrap
            sx={{
              flex: 1,
              fontWeight: 600,
              opacity: collapsed ? 0 : 1,
              transition: "opacity 150ms ease",
            }}
          >
            {workspaceName}
          </Typography>
          <ChevronDown
            sx={{
              color: "text.secondary",
              flexShrink: 0,
              fontSize: 14,
              opacity: collapsed ? 0 : 1,
              transition: "opacity 150ms ease",
            }}
          />
        </Box>
      </Tooltip>

      <Menu
        id="company-switcher-menu"
        anchorEl={menuAnchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        onClose={() => setMenuAnchorEl(null)}
        open={isMenuOpen}
        slotProps={{
          paper: {
            sx: { width: 250 },
          },
          list: {
            sx: { p: 0 },
          },
        }}
      >
        <Box
          sx={{
            minHeight: 36,
            maxHeight: 36,
            display: "flex",
            alignItems: "center",
            px: 1.75,
          }}
        >
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Switch Workspace
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ py: 1 }}>
          {companies.length === 0 && (
            <MenuItem disabled sx={{ minHeight: 42, px: 1.75 }}>
              <Typography color="text.secondary" fontSize={13}>
                No workspaces
              </Typography>
            </MenuItem>
          )}

          {companies.map((company) => {
            const isSelected = company.id === selectedCompanyId;

            return (
              <MenuItem
                key={company.id}
                onClick={() => handleCompanyChange(company.id)}
                selected={isSelected}
                sx={{
                  gap: 1.25,
                  mx: 0.75,
                  px: 0.75,
                  py: 0.75,
                  borderRadius: 1,
                  "&.Mui-selected": {
                    bgcolor: "transparent",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <WorkspaceLogo name={company.name} size={26} />
                <Stack flex={1} minWidth={0}>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      lineHeight: "18px",
                    }}
                  >
                    {company.name}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{
                      color: "text.secondary",
                      fontSize: 12,
                      lineHeight: "16px",
                    }}
                  >
                    {company.roleName}
                  </Typography>
                </Stack>
                {isSelected && (
                  <Check sx={{ color: "primary.main", fontSize: 17 }} />
                )}
              </MenuItem>
            );
          })}
        </Box>

        <Divider />
        <MenuItem
          onClick={handleOpenCreateDialog}
          sx={{
            color: "primary.main",
            p: 0,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="start"
            sx={{ width: 1, gap: 1, minHeight: 36, maxHeight: 36, px: 1.75 }}
          >
            <Plus sx={{ fontSize: 17 }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 0 }}>
              Create New Workspace
            </Typography>
          </Stack>
        </MenuItem>
      </Menu>

      <Dialog
        fullWidth
        maxWidth="xs"
        onClose={handleCreateDialogClose}
        open={isCreateDialogOpen}
      >
        <DialogTitle>Create company</DialogTitle>
        <DialogContent>
          <Stack
            component="form"
            gap={2}
            id="create-company-form"
            onSubmit={handleCreateCompany}
            pt={1}
          >
            {createError && <Alert severity="error">{createError}</Alert>}
            <TextField
              autoFocus
              disabled={createCompany.isPending}
              fullWidth
              label="Company name"
              onChange={(event) => setCompanyName(event.target.value)}
              value={companyName}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={createCompany.isPending}
            onClick={handleCreateDialogClose}
          >
            Cancel
          </Button>
          <Button
            disabled={createCompany.isPending}
            form="create-company-form"
            type="submit"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
