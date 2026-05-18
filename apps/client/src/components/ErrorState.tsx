import { Paper, Stack, Typography } from "@mui/material";

import { getErrorMessage } from "@/utils/getErrorMessage";

type ErrorStateProps = {
  error: unknown;
  fallback?: string;
  title?: string;
};

export const ErrorState = ({
  error,
  fallback = "Something went wrong.",
  title = "Could not load data.",
}: ErrorStateProps) => (
  <Stack p={{ xs: 2, sm: 3 }} width="100%">
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 3 }}
    >
      <Typography fontWeight={700}>{title}</Typography>
      <Typography color="text.secondary" fontSize={14}>
        {getErrorMessage(error, fallback)}
      </Typography>
    </Paper>
  </Stack>
);
