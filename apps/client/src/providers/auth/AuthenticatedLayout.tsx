import { CircularProgress, Stack } from "@mui/material";
import type { MeResponse } from "@syncr/packages";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";

import { useMe } from "@/api";
import { type StoreUser, useAuthStore } from "@/store/useAuthStore";

const buildStoreUserFromMe = (response: MeResponse): StoreUser => {
  return {
    id: response.id,
    email: response.email,
  };
};

export const AuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const { data: user, isPending, isSuccess } = useMe();

  useEffect(() => {
    if (!isSuccess || !user) {
      return;
    }

    const storeUser = buildStoreUserFromMe(user);

    setUser(storeUser);
  }, [isSuccess, setUser, user]);

  if (isPending) {
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
