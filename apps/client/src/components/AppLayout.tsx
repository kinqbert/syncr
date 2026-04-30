import { AuthenticatedLayout } from "@/providers/auth";
import { useGetMyCompanies } from "@/api/company";
import { useCompanyStore } from "@/store/useCompanyStore";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";

const CompanyRequiredPlaceholder = () => {
  return (
    <Stack
      alignItems="center"
      component="main"
      gap={1}
      justifyContent="center"
      minHeight="calc(100vh - 72px)"
      sx={{ width: "100%", p: 3, textAlign: "center" }}
    >
      <Typography variant="h5">Please select a company</Typography>
      <Typography color="text.secondary">
        Choose a company from the header to continue.
      </Typography>
    </Stack>
  );
};

const CompanyContent = () => {
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const { data: companies = [], isPending } = useGetMyCompanies();

  if (isPending) {
    return (
      <Stack alignItems="center" component="main" py={6} sx={{ width: "100%" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!selectedCompanyId || companies.length === 0) {
    return <CompanyRequiredPlaceholder />;
  }

  return <Outlet />;
};

export const AppLayout = () => {
  return (
    <AuthenticatedLayout>
      <Header />
      <Box display="flex">
        <Sidebar />
        <CompanyContent />
      </Box>
    </AuthenticatedLayout>
  );
};
