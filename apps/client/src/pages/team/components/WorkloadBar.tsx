import { Box, Stack, Typography } from "@mui/material";

import { formatPercent, normalizeWorkload } from "../utils/format";

const getWorkloadColor = (workload: number) => {
  if (workload >= 0.8) return "success.main";
  if (workload >= 0.4) return "warning.main";
  return "error.main";
};

export const WorkloadBar = ({ value }: { value: number }) => {
  const workload = normalizeWorkload(value);

  return (
    <Stack alignItems="center" direction="row" gap={1}>
      <Box
        sx={{
          bgcolor: "surface.active",
          borderRadius: 999,
          height: 4,
          overflow: "hidden",
          width: 56,
        }}
      >
        <Box
          sx={{
            bgcolor: getWorkloadColor(workload),
            height: "100%",
            width: `${workload * 100}%`,
          }}
        />
      </Box>
      <Typography
        color="text.secondary"
        sx={{ fontVariantNumeric: "tabular-nums" }}
        variant="body2"
      >
        {formatPercent(workload)}
      </Typography>
    </Stack>
  );
};
