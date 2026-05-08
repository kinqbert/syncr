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
        alignItems: "center",
        background:
          "radial-gradient(circle at top, rgba(79, 70, 229, 0.08), transparent 34%), #F9FAFB",
        display: "flex",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Stack gap={3.5}>
          <Stack gap={1.25} textAlign="center">
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: 38, sm: 48 },
                fontWeight: 700,
                letterSpacing: 0,
                lineHeight: 1.08,
              }}
            >
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 16 }}>
              {subtitle}
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: "0 18px 48px rgba(17, 24, 39, 0.12)",
              p: { xs: 3, sm: 4 },
            }}
          >
            {children}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
