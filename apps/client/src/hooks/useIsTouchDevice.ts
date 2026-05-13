import { useMediaQuery } from "@mui/material";

export const useIsTouchDevice = () => {
  return useMediaQuery("(hover: none), (pointer: coarse)");
};
