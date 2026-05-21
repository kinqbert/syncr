import { CircularProgress, Stack } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";

import { useMe } from "@/api";
import { ErrorState } from "@/components/ErrorState";
import { useAuthStore } from "@/store/useAuthStore";
import { buildStoreUserFromMe } from "@/utils/buildStoreUserFromMe";

export const AuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const { data: user, error, isError, isFetching, isPending, isSuccess } =
    useMe();

  useEffect(() => {
    if (!isSuccess || !user) {
      return;
    }

    const storeUser = buildStoreUserFromMe(user);

    setUser(storeUser);
  }, [isSuccess, setUser, user]);

  if (isPending || (!user && isFetching)) {
    return (
      <Stack minHeight="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (isError) {
    const status = axios.isAxiosError(error) ? error.response?.status : null;

    if (status !== 401 && status !== 403) {
      return (
        <Stack minHeight="100vh" alignItems="center" justifyContent="center">
          <ErrorState
            error={error}
            fallback="Could not connect to the server."
            title="Could not verify your session."
          />
        </Stack>
      );
    }
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
