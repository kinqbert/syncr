import { AppBar, Stack, Toolbar } from "@mui/material";

import { CompanySwitcher } from "./CompanySwitcher";
import { HeaderLogo } from "./HeaderLogo";
import { UserMenu } from "./UserMenu";

export const HEADER_HEIGHT = 64;

export const Header = () => {
  return (
    <AppBar
      color="default"
      elevation={0}
      position="sticky"
      sx={{
        height: HEADER_HEIGHT,
        backgroundColor: "background.paper",
        p: 0,

        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          height: HEADER_HEIGHT,
          minHeight: {
            xs: HEADER_HEIGHT,
            sm: HEADER_HEIGHT,
          },
        }}
      >
        <HeaderLogo alwaysCollapsedOnMobile hasBottomBorder />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flex={1}
          minWidth={0}
          px={2}
        >
          <CompanySwitcher />
          <UserMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
