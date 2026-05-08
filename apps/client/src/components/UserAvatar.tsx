import {
  Avatar,
  type AvatarProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import type { ReactNode } from "react";

import { getUserInitials } from "@/utils/getUserInitials";

type UserAvatarProps = Omit<AvatarProps, "children"> & {
  fallback?: ReactNode;
  name?: string | null;
  size?: number;
  surname?: string | null;
};

export const UserAvatar = ({
  fallback = "?",
  name,
  size = 32,
  surname,
  sx,
  ...props
}: UserAvatarProps) => {
  const initials =
    name || surname ? getUserInitials(name ?? "", surname ?? "") : null;
  const mergedSx: SxProps<Theme> = [
    {
      bgcolor: "#EEF2FF",
      color: "primary.main",
      fontSize: Math.max(11, Math.round(size * 0.38)),
      fontWeight: 700,
      height: size,
      width: size,
    },
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ];

  return (
    <Avatar sx={mergedSx} {...props}>
      {initials || fallback}
    </Avatar>
  );
};
