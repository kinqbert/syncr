import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Link, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  registerSchema,
  registerStepSchemas,
  type RegisterSchemaType,
  type RegisterSchemaTypeKeys,
} from "./validation";
import { StepRenderer } from "./components/StepRenderer";
import { Link as RouterLink } from "react-router";
import { useRegister } from "@/api";

const stepFields: RegisterSchemaTypeKeys[][] = [
  ["email"],
  ["password", "passwordConfirmation"],
  ["name", "surname"],
];

export const RegisterForm = () => {
  const { mutateAsync: register, isPending } = useRegister();

  const [step, setStep] = useState(1);

  const methods = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      name: "",
      surname: "",
    },
  });

  const onNextStep = () => {
    const currentStepFields = stepFields[step];
    const currentStepSchema = registerStepSchemas[step];

    methods.clearErrors(currentStepFields);

    const result = currentStepSchema.safeParse(methods.getValues());

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as RegisterSchemaTypeKeys | undefined;

        if (!field) return;

        methods.setError(field, {
          type: "manual",
          message: issue.message,
        });
      });

      return;
    }

    setStep((prev) => Math.min(prev + 1, stepFields.length - 1));
  };

  const onSubmit = async (data: RegisterSchemaType) => {
    const { passwordConfirmation, ...payload } = data;

    await register(payload);
  };

  const isLastStep = step === stepFields.length - 1;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack gap={2.5}>
          <Stack gap={0.5}>
            <Typography color="text.secondary">
              Step {step + 1} of {stepFields.length}
            </Typography>
          </Stack>

          <StepRenderer step={step} />

          {isLastStep ? (
            <Button type="submit" variant="contained" loading={isPending}>
              Finish
            </Button>
          ) : (
            <Button type="button" variant="contained" onClick={onNextStep}>
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
    </FormProvider>
  );
};
