import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { CalendarCheck, ExternalLink, Unplug } from "lucide-mui";

import {
  CalendarProvider,
  getCalendarConnectUrl,
  useCalendarConnections,
  useDisconnectCalendar,
} from "@/api/calendar";

const providerLabels: Record<CalendarProvider, string> = {
  [CalendarProvider.Google]: "Google Calendar",
};

const providers = [CalendarProvider.Google];

export const SettingsPage = () => {
  const { data: connections = [], isLoading } = useCalendarConnections();
  const disconnectCalendar = useDisconnectCalendar();

  const getConnection = (provider: CalendarProvider) =>
    connections.find((connection) => connection.provider === provider);

  return (
    <Stack width="100%" height="100%" p={3} gap={3}>
      <Stack gap={0.5}>
        <Typography variant="h4">Settings</Typography>
        <Typography color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Stack>

      <Stack
        border={1}
        borderColor="divider"
        borderRadius={2}
        divider={<Divider />}
        maxWidth={680}
      >
        <Stack gap={0.5} px={2.25} py={2}>
          <Typography fontSize={16} fontWeight={700}>
            Calendar sync
          </Typography>
          <Typography color="text.secondary" fontSize={13}>
            Task deadlines are created as all-day events in connected calendars.
          </Typography>
        </Stack>

        {providers.map((provider) => {
          const connection = getConnection(provider);
          const isConnected = Boolean(connection);

          return (
            <Stack
              alignItems="center"
              direction="row"
              gap={2}
              justifyContent="space-between"
              key={provider}
              minHeight={72}
              px={2.25}
              py={1.5}
            >
              <Stack direction="row" gap={1.5} minWidth={0}>
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
                  <CalendarCheck sx={{ color: "primary.main", fontSize: 20 }} />
                </Box>
                <Stack minWidth={0}>
                  <Stack alignItems="center" direction="row" gap={1}>
                    <Typography fontSize={14} fontWeight={700}>
                      {providerLabels[provider]}
                    </Typography>
                    {isConnected && (
                      <Chip color="success" label="Connected" size="small" />
                    )}
                  </Stack>
                  <Typography color="text.secondary" fontSize={13} noWrap>
                    {connection?.providerAccountEmail ?? "Not connected"}
                  </Typography>
                </Stack>
              </Stack>

              {isConnected ? (
                <Button
                  color="inherit"
                  disabled={disconnectCalendar.isPending}
                  onClick={() => disconnectCalendar.mutate(provider)}
                  startIcon={<Unplug sx={{ fontSize: 16 }} />}
                  variant="outlined"
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  disabled={isLoading}
                  href={getCalendarConnectUrl(provider)}
                  startIcon={<ExternalLink sx={{ fontSize: 16 }} />}
                  variant="contained"
                >
                  Connect
                </Button>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
