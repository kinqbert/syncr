import {
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useColorScheme,
} from "@mui/material";
import { Monitor, Moon, Palette, Sun } from "lucide-mui";

import { SettingsSectionHeader } from "./SettingsSectionHeader";

const MODES = [
  { value: "light", label: "Light", icon: <Sun /> },
  { value: "dark", label: "Dark", icon: <Moon /> },
  { value: "system", label: "System", icon: <Monitor /> },
] as const;

type Mode = (typeof MODES)[number]["value"];

export const AppearanceSettingsSection = () => {
  const { mode, setMode } = useColorScheme();

  return (
    <Stack
      bgcolor="background.paper"
      border={1}
      borderColor="divider"
      borderRadius={2}
      divider={<Divider />}
      id="appearance"
      sx={{ scrollMarginTop: 24 }}
      width="100%"
    >
      <SettingsSectionHeader
        description="Choose how Syncr looks on this device."
        icon={<Palette />}
        title="Appearance"
      />
      <Stack px={2} py={2}>
        <ToggleButtonGroup
          exclusive
          aria-label="Theme"
          onChange={(_, value: Mode | null) => {
            if (value) setMode(value);
          }}
          size="small"
          value={mode ?? "system"}
        >
          {MODES.map((item) => (
            <ToggleButton
              key={item.value}
              sx={{ gap: 0.75, px: 1.5, "& .MuiSvgIcon-root": { fontSize: 15 } }}
              value={item.value}
            >
              {item.icon}
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
};
