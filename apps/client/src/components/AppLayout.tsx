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
import { isDemoView } from "@/lib/demo";
import { AuthenticatedLayout } from "@/providers/auth";
import { useCompanyStore } from "@/store/useCompanyStore";

import { CompanyRequiredPlaceholder } from "./CompanyRequiredPlaceholder";
import { ConversationEventsListener } from "./ConversationEventsListener";
import { ErrorState } from "./ErrorState";
import { Header, HEADER_HEIGHT, MOBILE_DEMO_HEADER_HEIGHT } from "./Header";
import { NotificationsListener } from "./NotificationsListener";
import { Sidebar } from "./Sidebar";

const CompanyContent = () => {
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const isDemo = isDemoView();
  const {
    data: companies = [],
    error,
    isError,
    isPending,
  } = useGetMyCompanies();

  return (
    <Box
      height={{
        xs: `calc(100vh - ${
          isDemo ? MOBILE_DEMO_HEADER_HEIGHT : HEADER_HEIGHT
        }px)`,
        sm: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
      minWidth={0}
      sx={{
        flex: 1,
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
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const { mode } = useColorScheme();

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
        <Header />
        <Box display="flex" sx={{ overflow: "hidden" }}>
          {selectedCompanyId && <Sidebar />}
          <CompanyContent />
        </Box>
      </SocketProvider>
    </AuthenticatedLayout>
  );
};
