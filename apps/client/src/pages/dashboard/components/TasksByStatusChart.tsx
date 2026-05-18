import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  TASK_STATUS_LABEL,
  type DashboardTaskStatusPoint,
} from "@syncr/packages";

type TasksByStatusChartProps = {
  data: DashboardTaskStatusPoint[];
};

export const TasksByStatusChart = ({ data }: TasksByStatusChartProps) => {
  const totalTasks = data.reduce((sum, point) => sum + point.value, 0);
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
      <Stack gap={3} height="100%" minWidth={0}>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <Stack minWidth={0}>
            <Typography fontSize={18} fontWeight={800}>
              Tasks by Status
            </Typography>
            <Typography color="text.secondary" fontSize={13}>
              {totalTasks} tasks across active workstreams
            </Typography>
          </Stack>
        </Stack>

        <Stack gap={2}>
          {data.map((point) => {
            const percent = totalTasks > 0 ? Math.round((point.value / totalTasks) * 100) : 0;

            return (
              <Stack key={point.status} gap={0.75} minWidth={0}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                  <Typography fontSize={13} fontWeight={700} noWrap>
                    {TASK_STATUS_LABEL[point.status]}
                  </Typography>
                  <Typography color="text.secondary" fontSize={13} fontWeight={700}>
                    {point.value} · {percent}%
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    bgcolor: "grey.100",
                    borderRadius: 999,
                    height: 12,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      borderRadius: 999,
                      height: "100%",
                      minWidth: point.value > 0 ? 8 : 0,
                      width: `${(point.value / maxValue) * 100}%`,
                    }}
                  />
                </Box>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
};
