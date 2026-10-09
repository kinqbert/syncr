import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type SettingsSectionHeaderProps = {
  description: string;
  icon: ReactNode;
  title: string;
};

export const SettingsSectionHeader = ({
  description,
  icon,
  title,
}: SettingsSectionHeaderProps) => {
  return (
    <Stack direction="row" gap={1.25} minWidth={0} px={2} py={1.5}>
      <Box
        sx={{
          alignItems: "center",
          color: "text.secondary",
          display: "flex",
          flexShrink: 0,
          height: 20,
          justifyContent: "center",
          width: 20,
          "& .MuiSvgIcon-root": { color: "inherit", fontSize: 16 },
        }}
      >
        {icon}
      </Box>
      <Stack gap={0.25} minWidth={0}>
        <Typography component="h2" variant="h6">
          {title}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
};
