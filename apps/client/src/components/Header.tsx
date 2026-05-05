import { AppBar, Toolbar, Typography } from "@mui/material";

import { CompanySwitcher } from "./CompanySwitcher";

export const HEADER_HEIGHT = 64;

export const Header = () => {
  return (
    <AppBar
      color="default"
      elevation={1}
      position="sticky"
      sx={{ height: HEADER_HEIGHT, backgroundColor: "background.paper" }}
    >
      <Toolbar sx={{ gap: 2, justifyContent: "start" }}>
        <Typography variant="h6">Syncr</Typography>

        <CompanySwitcher />
      </Toolbar>
    </AppBar>
  );
};
