import { Box, Paper, Stack, Typography } from "@mui/material";
import { TrendingUp } from "lucide-mui";
import type { ReactNode } from "react";

type SummaryCardProps = {
  color: string;
  icon: ReactNode;
  label: string;
  trend?: number | null;
  trendLabel?: string;
  value: number;
};

export const SummaryCard = ({
  color,
  icon,
  label,
  trend,
  trendLabel,
  value,
}: SummaryCardProps) => {
  const trendText =
    trendLabel ??
    (trend == null
      ? null
      : `${trend >= 0 ? "+" : ""}${trend.toLocaleString()}%`);

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Stack gap={2.25}>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
        >
          <Box
            sx={{
              alignItems: "center",
              bgcolor: color,
              borderRadius: 2,
              color: "primary.main",
              display: "inline-flex",
              height: 48,
              justifyContent: "center",
              width: 48,
              "& .MuiSvgIcon-root": { fontSize: 23 },
            }}
          >
            {icon}
          </Box>
          {trendText ? (
            <Stack alignItems="center" direction="row" gap={0.5}>
              {trend != null && trend >= 0 ? (
                <TrendingUp sx={{ color: "success.main", fontSize: 16 }} />
              ) : null}
              <Typography
                color={
                  trend != null && trend < 0 ? "error.main" : "success.main"
                }
                fontSize={13}
                fontWeight={800}
              >
                {trendText}
              </Typography>
            </Stack>
          ) : null}
        </Stack>
        <Stack gap={0.25}>
          <Typography fontSize={{ xs: 26, sm: 28 }} fontWeight={800}>
            {value.toLocaleString()}
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            {label}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};
