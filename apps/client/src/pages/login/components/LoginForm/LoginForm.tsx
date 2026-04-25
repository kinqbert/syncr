import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchemaType } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useLogin } from "@/api";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(loginSchema) });

  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: login } = useLogin();

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      setError(null);
      await login(data);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={2.5}>
      <TextField
        {...register("email")}
        label="Email"
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      ></TextField>
      <TextField
        {...register("password")}
        label="Password"
        type="password"
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
      ></TextField>
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained">
        Login
      </Button>
      <Typography color="text.secondary" textAlign="center">
        New here?{" "}
        <Link component={RouterLink} to="/register">
          Create an account
        </Link>
      </Typography>
    </Stack>
  );
};
