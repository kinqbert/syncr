import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Stack gap={3}>
          <Stack gap={1} textAlign="center">
            <Typography variant="h3">{title}</Typography>
            <Typography color="text.secondary">{subtitle}</Typography>
          </Stack>

          <Paper elevation={3} sx={{ p: 4 }}>
            {children}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
