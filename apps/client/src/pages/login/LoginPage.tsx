import { CircularProgress, Link, Stack } from "@mui/material";
import { useEffect } from "react";
import { Link as RouterLink, Navigate } from "react-router";

import { useMe } from "@/api";
import { isDemoView } from "@/lib/demo";
import { useAuthStore } from "@/store/useAuthStore";
import { buildStoreUserFromMe } from "@/utils/buildStoreUserFromMe";

import { AuthLayout } from "../../components/AuthLayout";
import { LoginForm } from "./components/LoginForm/LoginForm";

export const LoginPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const { data: user, isFetching, isPending, isSuccess } = useMe();

  useEffect(() => {
    if (!isSuccess || !user) {
      return;
    }

    setUser(buildStoreUserFromMe(user));
  }, [isSuccess, setUser, user]);

  if (isDemoView()) {
    return <Navigate to="/" replace />;
  }

  if (isPending || (!user && isFetching)) {
    return (
      <Stack minHeight="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to Syncr."
      footer={
        <Link
          component={RouterLink}
          sx={{
            alignSelf: "center",
            color: "text.secondary",
            fontSize: 13,
            fontWeight: 500,
          }}
          to="/about"
        >
          About Syncr
        </Link>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
};
