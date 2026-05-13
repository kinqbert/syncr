import { Box, CircularProgress, Stack } from "@mui/material";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

import { useGetMyCompanies } from "@/api/companies";
import { SocketProvider } from "@/context/SocketContext/SocketProvider";
import { AuthenticatedLayout } from "@/providers/auth";
import { useCompanyStore } from "@/store/useCompanyStore";

import { CompanyRequiredPlaceholder } from "./CompanyRequiredPlaceholder";
import { ConversationEventsListener } from "./ConversationEventsListener";
import { Header, HEADER_HEIGHT } from "./Header";
import { NotificationsListener } from "./NotificationsListener";
import { Sidebar } from "./Sidebar";

const CompanyContent = () => {
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const { data: companies = [], isPending } = useGetMyCompanies();

  return (
    <Box
      height={`calc(100vh - ${HEADER_HEIGHT}px)`}
      minWidth={0}
      sx={{
        flex: 1,
        overflow: "auto",
        scrollbarColor: "#c0c0c0 transparent",
        scrollbarGutter: "stable",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          height: 8,
          width: 8,
        },
        "&::-webkit-scrollbar-button": {
          display: "none",
          height: 0,
          width: 0,
        },
        "&::-webkit-scrollbar-corner": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#9aa0a7",
          borderRadius: 999,
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#94A3B8",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
      }}
    >
      {isPending ? (
        <Stack
          alignItems="center"
          component="main"
          py={6}
          sx={{ width: "100%" }}
        >
          <CircularProgress />
        </Stack>
      ) : !selectedCompanyId || companies.length === 0 ? (
        <CompanyRequiredPlaceholder />
      ) : (
        <Outlet />
      )}
    </Box>
  );
};

export const AppLayout = () => {
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);

  return (
    <AuthenticatedLayout>
      <SocketProvider>
        <>
          <Toaster />
          <NotificationsListener />
          <ConversationEventsListener />
        </>
        <Header />
        <Box display="flex" sx={{ overflow: "hidden" }}>
          {selectedCompanyId && <Sidebar />}
          <CompanyContent />
        </Box>
      </SocketProvider>
    </AuthenticatedLayout>
  );
};
