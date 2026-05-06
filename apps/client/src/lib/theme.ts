import { createTheme } from "@mui/material";

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
  },
  palette: {
    mode: "light",

    // Primary Brand Color (Indigo)
    primary: {
      main: "#4F46E5",
      light: "#6366F1",
      dark: "#4338CA",
      contrastText: "#FFFFFF",
    },

    // Secondary Color (Purple)
    secondary: {
      main: "#9333EA",
      light: "#A855F7",
      dark: "#7E22CE",
      contrastText: "#FFFFFF",
    },

    // Success Color (Green)
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#047857",
      contrastText: "#FFFFFF",
    },

    // Warning Color (Orange)
    warning: {
      main: "#EA580C",
      light: "#F97316",
      dark: "#C2410C",
      contrastText: "#FFFFFF",
    },

    // Error Color (Red)
    error: {
      main: "#DC2626",
      light: "#EF4444",
      dark: "#B91C1C",
      contrastText: "#FFFFFF",
    },

    // Info Color (Blue)
    info: {
      main: "#2563EB",
      light: "#3B82F6",
      dark: "#1D4ED8",
      contrastText: "#FFFFFF",
    },

    // Background Colors
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF", // white
    },

    // Text Colors
    text: {
      primary: "#111827",
      secondary: "#4B5563",
      disabled: "#9CA3AF",
    },

    // Divider Color
    divider: "#E5E7EB", // gray-200

    // Action Colors
    action: {
      active: "#4F46E5", // indigo-600
      hover: "rgba(79, 70, 229, 0.04)", // indigo with opacity
      selected: "rgba(79, 70, 229, 0.08)",
      disabled: "#9CA3AF", // gray-400
      disabledBackground: "#F3F4F6", // gray-100
      focus: "rgba(79, 70, 229, 0.12)",
    },
  },
});
