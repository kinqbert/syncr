import { CircularProgress, Stack } from "@mui/material";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";

import { useMe } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import { buildStoreUserFromMe } from "@/utils/buildStoreUserFromMe";

export const AuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const { data: user, isFetching, isPending, isSuccess } = useMe();

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

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
