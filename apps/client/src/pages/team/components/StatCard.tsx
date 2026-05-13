import { Paper, Typography } from "@mui/material";

export const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Paper
    variant="outlined"
    sx={{
      borderRadius: 2,
      minHeight: { xs: 88, sm: 96 },
      p: { xs: 2, sm: 2.5 },
    }}
  >
    <Typography color="text.secondary" variant="body2">
      {label}
    </Typography>
    <Typography mt={0.75} variant="h5">
      {value}
    </Typography>
  </Paper>
);
