import "@mui/material/styles";

import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    kanban: {
      dragOver: string;
    };
  }

  interface PaletteOptions {
    kanban?: {
      bg?: string;
      bgActive?: string;
    };
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: "Inter",
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  palette: {
    mode: "light",

    primary: {
      main: "#4F46E5",
      light: "#6366F1",
      dark: "#4338CA",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#9333EA",
      light: "#A855F7",
      dark: "#7E22CE",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#047857",
      contrastText: "#FFFFFF",
    },

    warning: {
      main: "#EA580C",
      light: "#F97316",
      dark: "#C2410C",
      contrastText: "#FFFFFF",
    },

    error: {
      main: "#DC2626",
      light: "#EF4444",
      dark: "#B91C1C",
      contrastText: "#FFFFFF",
    },

    info: {
      main: "#2563EB",
      light: "#3B82F6",
      dark: "#1D4ED8",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#111827",
      secondary: "#4B5563",
      disabled: "#9CA3AF",
    },

    divider: "#E5E7EB",

    kanban: {
      bg: "#f4f7ff",
      bgActive: "#EEF2FF",
    },

    action: {
      active: "#4F46E5",
      hover: "rgba(79, 70, 229, 0.04)",
      selected: "rgba(79, 70, 229, 0.08)",
      disabled: "#9CA3AF",
      disabledBackground: "#F3F4F6",
      focus: "rgba(79, 70, 229, 0.12)",
    },
  },
});
