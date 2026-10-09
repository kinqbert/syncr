import { Button, Stack } from "@mui/material";
import { Compass } from "lucide-mui";
import { Link } from "react-router";

import { EmptyState } from "@/components/ui";

export const NotFoundPage = () => {
  return (
    <Stack
      alignItems="center"
      component="main"
      justifyContent="center"
      sx={{ bgcolor: "background.default", minHeight: "100dvh" }}
    >
      <EmptyState
        action={
          <Button component={Link} to="/" variant="contained">
            Back to dashboard
          </Button>
        }
        description="The page you're looking for doesn't exist or has moved."
        icon={<Compass />}
        title="Page not found"
      />
    </Stack>
  );
};
