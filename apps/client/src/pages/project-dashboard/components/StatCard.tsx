import { Box, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type StatCardProps = {
  helper: string;
  icon: ReactNode;
  label: string;
  value: string | number;
};

export const StatCard = ({ helper, icon, label, value }: StatCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        height: "100%",
        p: 2.5,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Stack gap={1}>
          <Typography color="text.secondary" fontSize={13} fontWeight={600}>
            {label}
          </Typography>
          <Typography fontSize={24} fontWeight={800}>
            {value}
          </Typography>
          <Typography color="text.secondary" fontSize={13}>
            {helper}
          </Typography>
        </Stack>
        <Box sx={{ color: "text.disabled" }}>{icon}</Box>
      </Stack>
    </Paper>
  );
};
