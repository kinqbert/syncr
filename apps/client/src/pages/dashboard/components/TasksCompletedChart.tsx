import { Box, Paper, Stack, Typography } from "@mui/material";
import type { DashboardChartPoint } from "@syncr/packages";

type TasksCompletedChartProps = {
  data: DashboardChartPoint[];
};

export const TasksCompletedChart = ({ data }: TasksCompletedChartProps) => {
  const maxValue = Math.max(1, ...data.map((point) => point.value));

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack gap={3}>
        <Typography fontSize={18} fontWeight={800}>
          Tasks Completed This Week
        </Typography>
        <Box
          sx={{
            alignItems: "end",
            display: "grid",
            gap: { xs: 1, sm: 2 },
            gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
            height: { xs: 300, sm: 420 },
            pt: 1,
          }}
        >
          {data.map((point) => (
            <Stack key={point.label} alignItems="center" gap={1} minWidth={0}>
              <Box
                sx={{
                  alignItems: "end",
                  display: "flex",
                  height: { xs: 250, sm: 365 },
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    borderRadius: "8px 8px 2px 2px",
                    height: `${Math.max(4, (point.value / maxValue) * 100)}%`,
                    minHeight: point.value > 0 ? 12 : 4,
                    width: "100%",
                  }}
                />
              </Box>
              <Typography color="text.secondary" fontSize={12} noWrap>
                {point.label}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
};
