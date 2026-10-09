import { Box, Container, Stack, Typography } from "@mui/material";
import { FolderKanban } from "lucide-mui";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthLayout = ({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) => {
  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        bgcolor: "background.default",
        display: "flex",
        minHeight: "100dvh",
        py: 6,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: 400 }}>
        <Stack gap={3}>
          <Stack alignItems="center" gap={2} textAlign="center">
            <Box
              aria-hidden
              sx={{
                alignItems: "center",
                bgcolor: "primary.main",
                borderRadius: 2,
                color: "primary.contrastText",
                display: "flex",
                height: 40,
                justifyContent: "center",
                width: 40,
              }}
            >
              <FolderKanban sx={{ fontSize: 22 }} />
            </Box>
            <Stack gap={0.5}>
              <Typography component="h1" variant="h2">
                {title}
              </Typography>
              <Typography color="text.secondary" variant="subtitle1">
                {subtitle}
              </Typography>
            </Stack>
          </Stack>

          <Box
            sx={{
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: 3,
              boxShadow: "var(--mui-palette-elevation-card)",
              p: { xs: 2.5, sm: 3 },
            }}
          >
            {children}
          </Box>

          {footer}
        </Stack>
      </Container>
    </Box>
  );
};
