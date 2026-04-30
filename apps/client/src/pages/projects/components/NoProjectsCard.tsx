import { Card, CardContent, Typography } from "@mui/material";

export const NoProjectsCard = () => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6">No projects yet</Typography>
        <Typography color="text.secondary" mt={1}>
          Create your first project to start organizing work.
        </Typography>
      </CardContent>
    </Card>
  );
};
