import {
  Box,
  CircularProgress,
  Stack,
  useColorScheme,
} from "@mui/material";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

import { useGetMyCompanies } from "@/api/companies";
import { SocketProvider } from "@/context/SocketContext/SocketProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSyncSelectedCompany } from "@/hooks/useSyncSelectedCompany";
import { isDemoView } from "@/lib/demo";
import { AuthenticatedLayout } from "@/providers/auth";
import { useCompanyStore } from "@/store/useCompanyStore";

import { DemoBanner, MobileTopBar } from "./AppTopBars";
import { CompanyRequiredPlaceholder } from "./CompanyRequiredPlaceholder";
import { ConversationEventsListener } from "./ConversationEventsListener";
import { ErrorState } from "./ErrorState";
import { NotificationsListener } from "./NotificationsListener";
import { Sidebar } from "./Sidebar";

const CompanyContent = () => {
  useSyncSelectedCompany();
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const {
    data: companies = [],
    error,
    isError,
    isPending,
  } = useGetMyCompanies();

  return (
    <Box
      minWidth={0}
      sx={{
        bgcolor: "background.default",
        flex: 1,
        minHeight: 0,
        overflow: "auto",
      }}
    >
      {isError ? (
        <ErrorState
          error={error}
          fallback="Could not load your companies."
          title="Could not load workspace."
        />
      ) : isPending ? (
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
  const { mode } = useColorScheme();
  const isMobile = useIsMobile();
  const isDemo = isDemoView();

  return (
    <AuthenticatedLayout>
      <SocketProvider>
        <>
          <Toaster
            richColors
            theme={mode ?? "system"}
            toastOptions={{
              classNames: {
                error: "sonner-error-toast",
              },
            }}
          />
          <NotificationsListener />
          <ConversationEventsListener />
        </>
        <Stack sx={{ height: "100dvh", overflow: "hidden" }}>
          {isDemo && <DemoBanner />}
          <Stack direction="row" sx={{ flex: 1, minHeight: 0 }}>
            <Sidebar />
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              {isMobile && <MobileTopBar />}
              <CompanyContent />
            </Stack>
          </Stack>
        </Stack>
      </SocketProvider>
    </AuthenticatedLayout>
  );
};
