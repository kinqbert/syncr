import { useMe } from "@/api";
import { useAuthStore, type StoreUser } from "@/store/useAuthStore";
import { CircularProgress, Stack } from "@mui/material";
import type { MeResponse } from "@syncr/packages";
import { Navigate, Outlet, useLocation } from "react-router";

const buildStoreUserFromMe = (response: MeResponse): StoreUser => {
  return {
    id: response.id,
    email: response.email,
  };
};

export const AuthenticatedLayout = () => {
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const { data: user, isPending, isSuccess } = useMe();

  if (isPending) {
    return (
      <Stack minHeight="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (isSuccess && user) {
    const storeUser = buildStoreUserFromMe(user);

    setUser(storeUser);
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
