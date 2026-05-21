import { AppBar, Link, Stack, Toolbar, Typography } from "@mui/material";

import { getRealWebsiteUrl, isDemoView } from "@/lib/demo";

import { CompanySwitcher } from "./CompanySwitcher";
import { HeaderLogo } from "./HeaderLogo";
import { UserMenu } from "./UserMenu";

export const HEADER_HEIGHT = 64;

export const Header = () => {
  const isDemo = isDemoView();

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
          <Stack direction="row" alignItems="center" gap={1.5} minWidth={0}>
            {isDemo && (
              <Typography
                color="text.secondary"
                fontSize={12}
                noWrap
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                This is a demo.{" "}
                <Link
                  color="primary"
                  href={getRealWebsiteUrl()}
                  rel="noreferrer"
                  target="_blank"
                  underline="hover"
                >
                  Visit the real website
                </Link>
                .
              </Typography>
            )}
            <UserMenu />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
