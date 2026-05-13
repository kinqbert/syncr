import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { CalendarCheck, ExternalLink, Unplug } from "lucide-mui";

import {
  CalendarProvider,
  getCalendarConnectUrl,
  useCalendarConnections,
  useDisconnectCalendar,
} from "@/api/calendar";

import { SettingsSectionHeader } from "./SettingsSectionHeader";

const providerLabels: Record<CalendarProvider, string> = {
  [CalendarProvider.Google]: "Google Calendar",
};

const providers = [CalendarProvider.Google];

export const CalendarSettingsSection = () => {
  const { data: connections = [], isLoading } = useCalendarConnections();
  const disconnectCalendar = useDisconnectCalendar();

  const getConnection = (provider: CalendarProvider) =>
    connections.find((connection) => connection.provider === provider);

  return (
    <Stack
      border={1}
      borderColor="divider"
      borderRadius={2}
      divider={<Divider />}
      maxWidth={760}
      width="100%"
    >
      <SettingsSectionHeader
        description="Task deadlines are created as all-day events in connected calendars."
        icon={<CalendarCheck sx={{ color: "primary.main", fontSize: 20 }} />}
        title="Calendar sync"
      />

      {providers.map((provider) => {
        const connection = getConnection(provider);
        const isConnected = Boolean(connection);

        return (
          <Stack
            alignItems={{ xs: "stretch", sm: "center" }}
            direction={{ xs: "column", sm: "row" }}
            gap={2}
            justifyContent="space-between"
            key={provider}
            minHeight={72}
            px={{ xs: 2, sm: 2.25 }}
            py={{ xs: 2, sm: 1.5 }}
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
                  <Typography fontSize={14} fontWeight={700} noWrap>
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
                sx={{ width: { xs: "100%", sm: "auto" } }}
                variant="outlined"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                disabled={isLoading}
                href={getCalendarConnectUrl(provider)}
                startIcon={<ExternalLink sx={{ fontSize: 16 }} />}
                sx={{ width: { xs: "100%", sm: "auto" } }}
                variant="contained"
              >
                Connect
              </Button>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};
