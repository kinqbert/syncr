import { AuthLayout } from "../../components/AuthLayout";
import { LoginForm } from "./components/LoginForm/LoginForm";

export const LoginPage = () => {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to Syncr.">
      <LoginForm />
    </AuthLayout>
  );
};
