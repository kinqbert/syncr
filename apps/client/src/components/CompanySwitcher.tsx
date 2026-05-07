import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  companiesKeys,
  useCreateCompany,
  useGetMyCompanies,
} from "@/api/companies";
import { queryClient, removeCompanyScopedCache } from "@/lib/react-query";
import { useCompanyStore } from "@/store/useCompanyStore";
import { getErrorMessage } from "@/utils/getErrorMessage";

const CREATE_COMPANY_VALUE = "__create_company__";

export const CompanySwitcher = () => {
  const navigate = useNavigate();

  const { data: companies = [], isPending } = useGetMyCompanies();
  const createCompany = useCreateCompany();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const setSelectedCompanyId = useCompanyStore(
    (state) => state.setSelectedCompanyId,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

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

  const handleCompanyChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value === CREATE_COMPANY_VALUE) {
      setIsCreateDialogOpen(true);
      return;
    }

    const nextCompanyId = Number(event.target.value);

    if (nextCompanyId === selectedCompanyId) {
      return;
    }

    navigate("/");

    setSelectedCompanyId(nextCompanyId);
    removeCompanyScopedCache();
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

      await queryClient.invalidateQueries({
        queryKey: companiesKeys.companies,
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
  const selectedValue = selectedCompany ? String(selectedCompany.id) : "";

  return (
    <>
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel id="company-switch-label">Company</InputLabel>
        <Select
          disabled={isPending}
          label="Company"
          labelId="company-switch-label"
          onChange={handleCompanyChange}
          value={selectedValue}
        >
          {companies.length === 0 && (
            <MenuItem disabled value="">
              No companies
            </MenuItem>
          )}

          {companies.map((company) => (
            <MenuItem key={company.id} value={String(company.id)}>
              {company.name}
            </MenuItem>
          ))}

          <Divider />
          <MenuItem value={CREATE_COMPANY_VALUE}>Create company</MenuItem>
        </Select>
      </FormControl>

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
