import { Box, Stack, Tooltip, Typography } from "@mui/material";
import {
  type DashboardTaskStatusPoint,
  TASK_STATUS_LABEL,
} from "@syncr/packages";
import { ChartNoAxesColumn } from "lucide-mui";

import { EmptyState, Section, StatusIcon } from "@/components/ui";

type TasksByStatusChartProps = {
  data: DashboardTaskStatusPoint[];
};

/** One stacked bar for the whole workflow plus a compact legend. */
export const TasksByStatusChart = ({ data }: TasksByStatusChartProps) => {
  const totalTasks = data.reduce((sum, point) => sum + point.value, 0);

  return (
    <Section
      description={`${totalTasks} tasks across active projects`}
      icon={<ChartNoAxesColumn />}
      title="Tasks by status"
    >
      {totalTasks === 0 ? (
        <EmptyState compact title="No tasks yet" />
      ) : (
        <Stack gap={2}>
          <Stack
            direction="row"
            gap="2px"
            sx={{ borderRadius: 1, height: 8, overflow: "hidden" }}
          >
            {data
              .filter((point) => point.value > 0)
              .map((point) => (
                <Tooltip
                  key={point.status}
                  title={`${TASK_STATUS_LABEL[point.status]}: ${point.value}`}
                >
                  <Box
                    sx={{
                      bgcolor: `status.${point.status}`,
                      flexGrow: point.value,
                      minWidth: 4,
                    }}
                  />
                </Tooltip>
              ))}
          </Stack>

          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(5, minmax(0, 1fr))",
              },
            }}
          >
            {data.map((point) => {
              const percent = Math.round((point.value / totalTasks) * 100);

              return (
                <Stack gap={0.25} key={point.status} minWidth={0}>
                  <Stack alignItems="center" direction="row" gap={0.75}>
                    <StatusIcon size={12} status={point.status} />
                    <Typography color="text.secondary" noWrap variant="body2">
                      {TASK_STATUS_LABEL[point.status]}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontVariantNumeric: "tabular-nums" }}>
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {point.value}
                    </Box>
                    <Box component="span" sx={{ color: "text.secondary", ml: 0.75 }}>
                      {percent}%
                    </Box>
                  </Typography>
                </Stack>
              );
            })}
          </Box>
        </Stack>
      )}
    </Section>
  );
};
