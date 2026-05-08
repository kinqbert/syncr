import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { Outlet } from "react-router";

import { useGetMyCompanies } from "@/api/companies";
import { NotificationsSocketProvider } from "@/context/NotificationSocketContext/NotificationSocketProvider";
import { AuthenticatedLayout } from "@/providers/auth";
import { useCompanyStore } from "@/store/useCompanyStore";

import { Header, HEADER_HEIGHT } from "./Header";
import { Sidebar } from "./Sidebar";

const CompanyRequiredPlaceholder = () => {
  return (
    <Stack
      alignItems="center"
      component="main"
      gap={1}
      justifyContent="center"
      minHeight={`calc(100vh - ${HEADER_HEIGHT}px)`}
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

  return (
    <Box
      height={`calc(100vh - ${HEADER_HEIGHT}px)`}
      minWidth={0}
      sx={{ flex: 1, overflow: "hidden" }}
    >
      <Outlet />
    </Box>
  );
};

export const AppLayout = () => {
  return (
    <AuthenticatedLayout>
      <NotificationsSocketProvider>
        <Header />
        <Box display="flex" sx={{ overflow: "hidden" }}>
          <Sidebar />
          <CompanyContent />
        </Box>
      </NotificationsSocketProvider>
    </AuthenticatedLayout>
  );
};
