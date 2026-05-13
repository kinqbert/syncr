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
    <Stack direction="row" gap={1.5} px={2.25} py={2}>
      <Box
        alignItems="center"
        border={1}
        borderColor="divider"
        borderRadius={1}
        display="flex"
        height={40}
        justifyContent="center"
        width={40}
      >
        {icon}
      </Box>
      <Stack gap={0.25}>
        <Typography fontSize={16} fontWeight={700}>
          {title}
        </Typography>
        <Typography color="text.secondary" fontSize={13}>
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
};
