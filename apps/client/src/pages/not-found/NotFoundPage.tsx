import { Stack, Typography } from "@mui/material";
import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <Stack
      width="100%"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <Typography variant="h3">Whoops! This page does not exist</Typography>
      <Typography color="text.secondary">
        Consider returning to the{" "}
        <Link style={{ color: "blue", textDecoration: "underline" }} to="/">
          home page.
        </Link>
      </Typography>
    </Stack>
  );
};
