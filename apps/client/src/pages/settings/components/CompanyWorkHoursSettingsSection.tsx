import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BriefcaseBusiness, Save } from "lucide-mui";
import { useState } from "react";
import { toast } from "sonner";

import {
  useGetMyCompanies,
  useUpdateCompanyUserSettings,
} from "@/api/companies";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { SettingsSectionHeader } from "./SettingsSectionHeader";

const minutesToHours = (minutes: number) => minutes / 60;
const hoursToMinutes = (hours: number) => Math.round(hours * 60);

export const CompanyWorkHoursSettingsSection = () => {
  const {
    data: companies = [],
    error,
    isError,
    isLoading,
  } = useGetMyCompanies();
  const updateCompanyUserSettings = useUpdateCompanyUserSettings();
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [weeklyLoadHourOverrides, setWeeklyLoadHourOverrides] = useState<
    Record<number, string>
  >({});

  const handleSave = async (companyId: number) => {
    const company = companies.find((company) => company.id === companyId);
    const weeklyLoadHours = Number(
      weeklyLoadHourOverrides[companyId] ??
        (company ? minutesToHours(company.weeklyLoadMinutes) : ""),
    );

    if (
      Number.isNaN(weeklyLoadHours) ||
      weeklyLoadHours < 1 ||
      weeklyLoadHours > 168
    ) {
      toast.error("Work hours must be between 1 and 168 hours.");
      return;
    }

    setEditingCompanyId(companyId);

    try {
      await updateCompanyUserSettings.mutateAsync({
        companyId,
        body: {
          weeklyLoadMinutes: hoursToMinutes(weeklyLoadHours),
        },
      });
      setWeeklyLoadHourOverrides((current) => {
        const { [companyId]: _, ...next } = current;
        void _;

        return next;
      });
      toast.success("Company work hours updated.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update work hours."));
    } finally {
      setEditingCompanyId(null);
    }
  };

  return (
    <Stack
      border={1}
      borderColor="divider"
      borderRadius={2}
      divider={<Divider />}
      maxWidth={760}
      width="100%"
    >
      <SettingsSectionHeader
        description="Set your weekly capacity separately for each company."
        icon={
          <BriefcaseBusiness sx={{ color: "primary.main", fontSize: 20 }} />
        }
        title="Company work hours"
      />

      {isLoading ? (
        <Stack alignItems="center" py={3}>
          <CircularProgress size={24} />
        </Stack>
      ) : null}

      {isError ? (
        <Alert severity="error" sx={{ m: 2 }}>
          {getErrorMessage(error, "Could not load companies.")}
        </Alert>
      ) : null}

      {!isLoading && !isError && companies.length === 0 ? (
        <Typography color="text.secondary" fontSize={14} px={2.25} py={2}>
          Join or create a company to set company-specific work hours.
        </Typography>
      ) : null}

      {!isLoading &&
        !isError &&
        companies.map((company) => {
          const savedWeeklyLoadHours = minutesToHours(
            company.weeklyLoadMinutes,
          );
          const weeklyLoadHours =
            weeklyLoadHourOverrides[company.id] ?? String(savedWeeklyLoadHours);
          const numericWeeklyLoadHours = Number(weeklyLoadHours);
          const hasChanged =
            weeklyLoadHourOverrides[company.id] !== undefined &&
            numericWeeklyLoadHours !== savedWeeklyLoadHours;
          const isInvalid =
            weeklyLoadHours === "" ||
            Number.isNaN(numericWeeklyLoadHours) ||
            numericWeeklyLoadHours < 1 ||
            numericWeeklyLoadHours > 168;
          const isSaving = editingCompanyId === company.id;

          return (
            <Stack
              alignItems={{ xs: "stretch", sm: "center" }}
              direction={{ xs: "column", sm: "row" }}
              gap={2}
              justifyContent="space-between"
              key={company.id}
              minHeight={76}
              px={{ xs: 2, sm: 2.25 }}
              py={{ xs: 2, sm: 1.5 }}
            >
              <Stack minWidth={0}>
                <Typography fontSize={14} fontWeight={700} noWrap>
                  {company.name}
                </Typography>
                <Typography color="text.secondary" fontSize={13} noWrap>
                  {company.roleName}
                </Typography>
              </Stack>

              <Box
                sx={{
                  alignItems: { xs: "stretch", sm: "center" },
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: { xs: "1fr", sm: "150px auto" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <TextField
                  disabled={isSaving}
                  error={isInvalid}
                  helperText={isInvalid ? "1-168 hours" : " "}
                  inputProps={{ step: 0.5, min: 1, max: 168 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">hours</InputAdornment>
                    ),
                  }}
                  label="Weekly load"
                  onChange={(event) =>
                    setWeeklyLoadHourOverrides((current) => ({
                      ...current,
                      [company.id]: event.target.value,
                    }))
                  }
                  size="small"
                  type="number"
                  value={weeklyLoadHours}
                />
                <Button
                  disabled={isSaving || isInvalid || !hasChanged}
                  onClick={() => void handleSave(company.id)}
                  startIcon={<Save sx={{ fontSize: 16 }} />}
                  sx={{ height: 40 }}
                  variant="contained"
                >
                  Save
                </Button>
              </Box>
            </Stack>
          );
        })}
    </Stack>
  );
};
