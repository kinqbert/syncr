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
  Typography,
} from "@mui/material";
import {
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Plus,
} from "lucide-mui";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useCreateCompany, useGetMyCompanies } from "@/api/companies";
import { removeCompanyScopedCache } from "@/lib/react-query";
import { useCompanyStore } from "@/store/useCompanyStore";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const CompanySwitcher = () => {
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

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (companies.length === 0) {
      if (selectedCompanyId !== null) {
        setSelectedCompanyId(null);
        removeCompanyScopedCache();
      }

      return;
    }

    const hasSelectedCompany = companies.some(
      (company) => company.id === selectedCompanyId,
    );

    if (!hasSelectedCompany) {
      setSelectedCompanyId(companies[0].id);

      if (selectedCompanyId !== null) {
        removeCompanyScopedCache();
      }
    }
  }, [companies, isPending, selectedCompanyId, setSelectedCompanyId]);

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

  return (
    <>
      <Button
        aria-controls={isMenuOpen ? "company-switcher-menu" : undefined}
        aria-expanded={isMenuOpen ? "true" : undefined}
        aria-haspopup="menu"
        disabled={isPending}
        onClick={(event) => setMenuAnchorEl(event.currentTarget)}
        sx={{
          border: 1,
          borderColor: isMenuOpen ? "primary.light" : "divider",
          borderRadius: 1.25,
          color: "text.primary",
          height: 40,
          justifyContent: "space-between",
          minWidth: 220,
          px: 1.5,
          py: 0.75,
          textAlign: "left",
          "&:hover": {
            bgcolor: "background.paper",
            borderColor: "primary.light",
          },
        }}
        variant="outlined"
      >
        <Stack direction="row" alignItems="center" gap={1.25} minWidth={0}>
          <BriefcaseBusiness sx={{ color: "text.secondary", fontSize: 18 }} />
          <Stack minWidth={0}>
            <Typography
              component="span"
              noWrap
              sx={{ fontSize: 13, fontWeight: 600, lineHeight: "17px" }}
            >
              {selectedCompany?.name ?? "Select workspace"}
            </Typography>
            <Typography
              component="span"
              noWrap
              sx={{
                color: "text.secondary",
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "15px",
              }}
            >
              {companies.length === 1
                ? "1 workspace"
                : `${companies.length} workspaces`}
            </Typography>
          </Stack>
        </Stack>
        <ChevronDown
          sx={{
            color: "text.secondary",
            fontSize: 16,
            ml: 1,
            transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 160ms ease",
          }}
        />
      </Button>

      <Menu
        id="company-switcher-menu"
        anchorEl={menuAnchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        onClose={() => setMenuAnchorEl(null)}
        open={isMenuOpen}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              borderRadius: 1.25,
              mt: 0.75,
              width: 250,
            },
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
                <Box
                  sx={{
                    height: 32,
                    width: 32,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    borderRadius: 1.25,

                    bgcolor: "secondary.main",
                    color: "secondary.contrastText",
                  }}
                >
                  <Building2 sx={{ fontSize: 17 }} />
                </Box>
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
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
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
