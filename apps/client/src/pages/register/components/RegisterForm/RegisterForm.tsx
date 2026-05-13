import {
  Alert,
  Box,
  Button,
  Link,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router";

import { useRegister } from "@/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { StepRenderer } from "./components/StepRenderer";
import {
  registerSchema,
  type RegisterSchemaType,
  type RegisterSchemaTypeKeys,
  registerStepSchemas,
} from "./validation";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: register, isPending } = useRegister();

  const methods = useForm<RegisterSchemaType>({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      name: "",
      surname: "",
    },
  });

  const setValidationErrors = (
    issues: { path: PropertyKey[]; message: string }[],
  ) => {
    issues.forEach((issue) => {
      const field = issue.path[0] as RegisterSchemaTypeKeys | undefined;

      if (!field) return;

      methods.setError(field, {
        type: "manual",
        message: issue.message,
      });
    });
  };

  const onNextStep = () => {
    methods.clearErrors();

    const currentStepSchema = registerStepSchemas[step];

    const result = currentStepSchema.safeParse(methods.getValues());

    if (!result.success) {
      setValidationErrors(result.error.issues);

      return;
    }

    setStep((prev) => Math.min(prev + 1, registerStepSchemas.length - 1));
  };

  const onSubmit = async () => {
    methods.clearErrors();
    setErrorMessage(null);

    const result = registerSchema.safeParse(methods.getValues());

    if (!result.success) {
      setValidationErrors(result.error.issues);

      return;
    }

    const payload = {
      email: result.data.email,
      password: result.data.password,
      name: result.data.name,
      surname: result.data.surname,
    };

    try {
      await register(payload);
      navigate("/login");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to create account."));
    }
  };

  const isLastStep = step === registerStepSchemas.length - 1;
  const isErrorSnackbarOpen = Boolean(errorMessage);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLastStep) {
      void onSubmit();
      return;
    }

    onNextStep();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={onFormSubmit}>
        <Stack gap={2.5}>
          <Stack gap={1}>
            <Typography color="text.secondary" fontWeight={500}>
              Step {step + 1} of {registerStepSchemas.length}
            </Typography>
            <Box
              aria-hidden
              sx={{
                bgcolor: "#EEF2FF",
                borderRadius: 999,
                height: 6,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  bgcolor: "primary.main",
                  height: "100%",
                  transition: "width 180ms ease",
                  width: `${((step + 1) / registerStepSchemas.length) * 100}%`,
                }}
              />
            </Box>
          </Stack>

          <StepRenderer step={step} />

          {isLastStep ? (
            <Button
              type="submit"
              variant="contained"
              loading={isPending}
            >
              Finish
            </Button>
          ) : (
            <Button type="submit" variant="contained">
              Next
            </Button>
          )}

          <Typography color="text.secondary" textAlign="center">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </form>
      <Snackbar
        open={isErrorSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </FormProvider>
  );
};
