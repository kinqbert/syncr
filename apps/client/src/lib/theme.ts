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
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: "20px",
          minHeight: 40,
          padding: "10px 16px",
        },
        sizeSmall: {
          fontSize: 13,
          lineHeight: "18px",
          minHeight: 32,
          padding: "7px 12px",
        },
        sizeLarge: {
          fontSize: 15,
          lineHeight: "22px",
          minHeight: 44,
          padding: "11px 18px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#4F46E5",
          "&:hover": {
            backgroundColor: "#4338CA",
          },
        },
        startIcon: {
          marginLeft: -2,
          marginRight: 8,
          "& > *:nth-of-type(1)": {
            fontSize: 17,
          },
        },
        endIcon: {
          marginLeft: 8,
          marginRight: -2,
          "& > *:nth-of-type(1)": {
            fontSize: 17,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: "0 24px 56px rgba(17, 24, 39, 0.24)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "#111827",
          fontSize: 20,
          fontWeight: 700,
          lineHeight: "28px",
          padding: "22px 20px 8px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "8px 20px 16px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          gap: 10,
          padding: "10px 20px 22px",
          "& > .MuiButton-root": {
            flex: 1,
          },
          "& > .MuiButton-text": {
            backgroundColor: "#F3F4F6",
            color: "#374151",
            "&:hover": {
              backgroundColor: "#E5E7EB",
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          gap: 6,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#374151",
          fontSize: 13,
          fontWeight: 500,
          lineHeight: "18px",
          position: "relative",
          transform: "none",
          whiteSpace: "normal",
          "&.Mui-focused": {
            color: "#374151",
          },
          "&.Mui-error": {
            color: "#B91C1C",
          },
        },
        outlined: {
          maxWidth: "100%",
          transform: "none",
          "&.MuiInputLabel-shrink": {
            maxWidth: "100%",
            transform: "none",
          },
        },
        sizeSmall: {
          transform: "none",
          "&.MuiInputLabel-shrink": {
            transform: "none",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#F9FAFB",
          borderRadius: 8,
          color: "#111827",
          fontSize: 14,
          lineHeight: "20px",
          minHeight: 40,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E5E7EB",
            padding: 0,
            top: 0,
            transition:
              "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
          },
          "& .MuiOutlinedInput-notchedOutline legend": {
            height: 0,
            lineHeight: 0,
            maxWidth: 0,
            padding: 0,
            width: 0,
          },
          "& .MuiOutlinedInput-notchedOutline legend > span": {
            display: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D1D5DB",
          },
          "&.Mui-focused": {
            backgroundColor: "#FFFFFF",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4F46E5",
            borderWidth: 2,
            boxShadow: "0 0 0 1px rgba(79, 70, 229, 0.12)",
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#DC2626",
          },
          "&.Mui-disabled": {
            backgroundColor: "#F3F4F6",
          },
        },
        input: {
          backgroundColor: "transparent",
          height: "20px",
          padding: "10px 14px",
          "&::placeholder": {
            color: "#6B7280",
            opacity: 0.72,
          },
        },
        multiline: {
          alignItems: "flex-start",
          minHeight: 74,
          padding: 0,
        },
        inputMultiline: {
          backgroundColor: "transparent",
          height: "auto",
          padding: "10px 14px",
        },
        sizeSmall: {
          minHeight: 40,
          "& .MuiOutlinedInput-input": {
            padding: "10px 14px",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          minHeight: "20px",
          padding: "10px 38px 10px 14px",
        },
        icon: {
          color: "#111827",
          right: 10,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: 12,
          lineHeight: "16px",
          marginLeft: 0,
          marginRight: 0,
          marginTop: 4,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          boxShadow: "0 12px 28px rgba(17, 24, 39, 0.16)",
          marginTop: 6,
          overflow: "hidden",
        },
        list: {
          paddingBottom: 6,
          paddingTop: 6,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          color: "#111827",
          fontSize: 14,
          lineHeight: "20px",
          minHeight: 40,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 8,
          transition: "background-color 140ms ease, color 140ms ease",
          "&:hover": {
            backgroundColor: "#F3F4F6",
          },
          "&.Mui-selected": {
            backgroundColor: "#EEF2FF",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#E0E7FF",
          },
          "&.MuiMenuItem-divider": {
            borderBottomColor: "#E5E7EB",
            marginBottom: 6,
          },
          "&.MuiMenuItem-divider + .MuiMenuItem-root": {
            marginTop: 6,
          },
        },
      },
    },
  },
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
