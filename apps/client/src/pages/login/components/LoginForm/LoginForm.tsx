import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router";

import { useLogin } from "@/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { loginSchema, type LoginSchemaType } from "./validation";

export const LoginForm = () => {
  const navigate = useNavigate();
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
      navigate("/");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={2.5}>
      <TextField
        {...register("email")}
        label="Email"
        placeholder="you@example.com"
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      />

      <TextField
        {...register("password")}
        label="Password"
        placeholder="Enter password"
        type="password"
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
      />

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
