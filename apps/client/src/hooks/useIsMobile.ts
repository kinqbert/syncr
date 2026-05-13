import { useMediaQuery } from "@mui/material";

import { theme } from "@/lib/theme";

export const useIsMobile = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile;
};
