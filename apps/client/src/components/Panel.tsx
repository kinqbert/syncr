import { Box } from "@mui/material";

type PanelProps = {
  children: React.ReactNode;
};

export const Panel = ({ children }: PanelProps) => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2.25,
      }}
    >
      {children}
    </Box>
  );
};
