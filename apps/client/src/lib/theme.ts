import "@mui/material/styles";

import { createTheme, type Theme } from "@mui/material";
import type { ProjectStatus, TaskPriority, TaskStatus } from "@syncr/packages";

type Tint = { bg: string; fg: string };
type TintName =
  | "gray"
  | "indigo"
  | "blue"
  | "green"
  | "amber"
  | "orange"
  | "red"
  | "violet"
  | "pink";

type SyncrPalette = {
  /** Neutral surfaces layered on top of `background`. */
  surface: {
    sidebar: string;
    subtle: string;
    hover: string;
    active: string;
  };
  /** Border strengths; `divider` is the default one. */
  line: {
    subtle: string;
    strong: string;
  };
  /** Low-emphasis accent used for selected and highlighted states. */
  accent: {
    soft: string;
    softHover: string;
    text: string;
  };
  /** High-contrast surface for banners and hero blocks. */
  inverse: {
    bg: string;
    fg: string;
    muted: string;
    overlay: string;
  };
  status: Record<TaskStatus, string>;
  priority: Record<TaskPriority, string>;
  projectStatus: Record<ProjectStatus, string>;
  tint: Record<TintName, Tint>;
  elevation: {
    card: string;
    popover: string;
    dialog: string;
  };
};

declare module "@mui/material/styles" {
  interface CssThemeVariables {
    enabled: true;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Palette extends SyncrPalette {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface PaletteOptions extends Partial<SyncrPalette> {}
}

export type { TintName };

const light = {
  primary: {
    main: "#5E6AD2",
    light: "#7C86DE",
    dark: "#4C57BD",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#8B5CF6",
    light: "#A78BFA",
    dark: "#7C3AED",
    contrastText: "#FFFFFF",
  },
  success: {
    main: "#2F9E6B",
    light: "#4CB884",
    dark: "#23805A",
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#D9822B",
    light: "#E59B4F",
    dark: "#B86A1E",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#D9483B",
    light: "#E2675C",
    dark: "#B9382C",
    contrastText: "#FFFFFF",
  },
  info: {
    main: "#3B82D9",
    light: "#5A98E2",
    dark: "#2C69B8",
    contrastText: "#FFFFFF",
  },
  background: { default: "#FBFBFC", paper: "#FFFFFF" },
  text: { primary: "#1B1C1F", secondary: "#62666F", disabled: "#A0A3AB" },
  divider: "#E6E7EA",
  surface: {
    sidebar: "#F7F7F8",
    subtle: "#F4F4F6",
    hover: "#EFEFF2",
    active: "#E8E9ED",
  },
  line: { subtle: "#EFEFF1", strong: "#D4D6DB" },
  accent: { soft: "#EEEFFB", softHover: "#E4E6F8", text: "#4C57BD" },
  inverse: {
    bg: "#1B1C1F",
    fg: "#FFFFFF",
    muted: "#A0A3AB",
    overlay: "rgba(255, 255, 255, 0.12)",
  },
  status: {
    backlog: "#A0A3AB",
    todo: "#6E727C",
    in_progress: "#E0A030",
    review: "#5E6AD2",
    done: "#2F9E6B",
  },
  priority: { low: "#8A8E97", medium: "#E0A030", high: "#D9483B" },
  projectStatus: {
    active: "#2F9E6B",
    paused: "#E0A030",
    completed: "#5E6AD2",
    archived: "#A0A3AB",
  },
  tint: {
    gray: { bg: "#F0F1F3", fg: "#4B4F58" },
    indigo: { bg: "#EEEFFB", fg: "#4C57BD" },
    blue: { bg: "#EAF2FC", fg: "#2C69B8" },
    green: { bg: "#E8F5EE", fg: "#23805A" },
    amber: { bg: "#FBF3E2", fg: "#9A6A12" },
    orange: { bg: "#FCEEE2", fg: "#B05A16" },
    red: { bg: "#FCEBEA", fg: "#B9382C" },
    violet: { bg: "#F2EDFD", fg: "#6D43D6" },
    pink: { bg: "#FCEDF4", fg: "#B5306E" },
  },
  elevation: {
    card: "0 1px 2px rgba(16, 18, 24, 0.04)",
    popover:
      "0 0 0 1px rgba(16, 18, 24, 0.06), 0 8px 24px rgba(16, 18, 24, 0.10)",
    dialog:
      "0 0 0 1px rgba(16, 18, 24, 0.06), 0 24px 56px rgba(16, 18, 24, 0.18)",
  },
  action: {
    active: "#62666F",
    hover: "rgba(16, 18, 24, 0.04)",
    selected: "rgba(94, 106, 210, 0.08)",
    disabled: "#A0A3AB",
    disabledBackground: "#F0F1F3",
    focus: "rgba(94, 106, 210, 0.16)",
  },
};

const dark: typeof light = {
  primary: {
    main: "#7C86E8",
    light: "#9AA2F0",
    dark: "#6670DA",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#A78BFA",
    light: "#C4B5FD",
    dark: "#8B5CF6",
    contrastText: "#FFFFFF",
  },
  success: {
    main: "#4CB884",
    light: "#6FCB9D",
    dark: "#2F9E6B",
    contrastText: "#0F1012",
  },
  warning: {
    main: "#E59B4F",
    light: "#EEB57A",
    dark: "#D9822B",
    contrastText: "#0F1012",
  },
  error: {
    main: "#E86A5E",
    light: "#F08C82",
    dark: "#D9483B",
    contrastText: "#FFFFFF",
  },
  info: {
    main: "#5A98E2",
    light: "#80B0EA",
    dark: "#3B82D9",
    contrastText: "#FFFFFF",
  },
  background: { default: "#0F1012", paper: "#161719" },
  text: { primary: "#E6E7EA", secondary: "#9DA1AA", disabled: "#62656D" },
  divider: "#26282C",
  surface: {
    sidebar: "#121315",
    subtle: "#1B1C1F",
    hover: "#212226",
    active: "#292A2F",
  },
  line: { subtle: "#1F2023", strong: "#383A40" },
  accent: { soft: "#22253F", softHover: "#2A2E4E", text: "#AEB4F3" },
  inverse: {
    bg: "#232428",
    fg: "#E6E7EA",
    muted: "#9DA1AA",
    overlay: "rgba(255, 255, 255, 0.08)",
  },
  status: {
    backlog: "#6E727C",
    todo: "#A0A3AB",
    in_progress: "#E6AE48",
    review: "#7C86E8",
    done: "#4CB884",
  },
  priority: { low: "#8A8E97", medium: "#E6AE48", high: "#E86A5E" },
  projectStatus: {
    active: "#4CB884",
    paused: "#E6AE48",
    completed: "#7C86E8",
    archived: "#6E727C",
  },
  tint: {
    gray: { bg: "#232428", fg: "#B9BCC3" },
    indigo: { bg: "#22253F", fg: "#AEB4F3" },
    blue: { bg: "#1A2738", fg: "#8DB8EE" },
    green: { bg: "#17291F", fg: "#7FD1A6" },
    amber: { bg: "#2C2414", fg: "#EBC27A" },
    orange: { bg: "#2E2016", fg: "#F0A970" },
    red: { bg: "#301B19", fg: "#F2958C" },
    violet: { bg: "#261F3A", fg: "#C2AEFA" },
    pink: { bg: "#2F1B26", fg: "#F190BE" },
  },
  elevation: {
    card: "0 1px 2px rgba(0, 0, 0, 0.3)",
    popover:
      "0 0 0 1px rgba(255, 255, 255, 0.06), 0 8px 24px rgba(0, 0, 0, 0.5)",
    dialog:
      "0 0 0 1px rgba(255, 255, 255, 0.06), 0 24px 56px rgba(0, 0, 0, 0.6)",
  },
  action: {
    active: "#9DA1AA",
    hover: "rgba(255, 255, 255, 0.04)",
    selected: "rgba(124, 134, 232, 0.12)",
    disabled: "#62656D",
    disabledBackground: "#232428",
    focus: "rgba(124, 134, 232, 0.24)",
  },
};

const FONT_FAMILY =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/** Shared focus ring for interactive controls. */
export const focusRing = (theme: Theme) => ({
  outline: `2px solid ${theme.vars.palette.primary.main}`,
  outlineOffset: 1,
});

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data" },
  colorSchemes: {
    light: { palette: light },
    dark: { palette: dark },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    h1: { fontSize: 28, fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.02em" },
    h2: { fontSize: 24, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.015em" },
    h3: { fontSize: 20, fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.01em" },
    h4: { fontSize: 18, fontWeight: 600, lineHeight: 1.4, letterSpacing: "-0.01em" },
    h5: { fontSize: 16, fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: 14, fontWeight: 600, lineHeight: 1.45 },
    subtitle1: { fontSize: 14, fontWeight: 500, lineHeight: 1.45 },
    subtitle2: { fontSize: 13, fontWeight: 500, lineHeight: 1.45 },
    body1: { fontSize: 13, lineHeight: 1.5 },
    body2: { fontSize: 12, lineHeight: 1.45 },
    caption: { fontSize: 12, lineHeight: 1.4 },
    overline: {
      fontSize: 11,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "0.04em",
    },
    button: { fontSize: 13, fontWeight: 500, textTransform: "none" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFeatureSettings: '"cv11", "ss01"',
          WebkitFontSmoothing: "antialiased",
        },
      },
    },
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          lineHeight: "18px",
          minHeight: 32,
          padding: "6px 12px",
          transition: "background-color 120ms ease, border-color 120ms ease",
          "&.Mui-focusVisible": focusRing(theme),
        }),
        sizeSmall: {
          fontSize: 12,
          minHeight: 28,
          padding: "4px 10px",
        },
        sizeLarge: {
          fontSize: 14,
          minHeight: 38,
          padding: "8px 16px",
        },
        outlined: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
          borderColor: theme.vars.palette.divider,
          color: theme.vars.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.vars.palette.surface.hover,
            borderColor: theme.vars.palette.line.strong,
          },
        }),
        text: ({ theme }) => ({
          "&:hover": { backgroundColor: theme.vars.palette.surface.hover },
        }),
        textInherit: ({ theme }) => ({
          color: theme.vars.palette.text.secondary,
        }),
        startIcon: {
          marginLeft: -2,
          marginRight: 6,
          "& > *:nth-of-type(1)": { fontSize: 16 },
        },
        endIcon: {
          marginLeft: 6,
          marginRight: -2,
          "& > *:nth-of-type(1)": { fontSize: 16 },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 6,
          color: theme.vars.palette.text.secondary,
          "&:hover": {
            backgroundColor: theme.vars.palette.surface.hover,
            color: theme.vars.palette.text.primary,
          },
          "&.Mui-focusVisible": focusRing(theme),
        }),
        sizeSmall: { padding: 4, "& .MuiSvgIcon-root": { fontSize: 16 } },
        sizeMedium: { padding: 6, "& .MuiSvgIcon-root": { fontSize: 18 } },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: "none" },
        outlined: ({ theme }) => ({
          borderColor: theme.vars.palette.divider,
        }),
      },
    },
    MuiCard: {
      defaultProps: { variant: "outlined" },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
          borderRadius: 10,
          boxShadow: theme.vars.palette.elevation.dialog,
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 16,
          fontWeight: 600,
          lineHeight: "24px",
          padding: "18px 20px 6px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { padding: "8px 20px 16px" },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          gap: 8,
          padding: "8px 20px 18px",
          "& > :not(style) ~ :not(style)": { marginLeft: 0 },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          "&:not(.MuiBackdrop-invisible)": {
            backgroundColor: "rgba(10, 11, 13, 0.4)",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: { gap: 6 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.vars.palette.text.secondary,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "16px",
          position: "relative",
          transform: "none",
          whiteSpace: "normal",
          "&.Mui-focused": { color: theme.vars.palette.text.secondary },
          "&.Mui-error": { color: theme.vars.palette.error.main },
        }),
        outlined: {
          maxWidth: "100%",
          transform: "none",
          "&.MuiInputLabel-shrink": { maxWidth: "100%", transform: "none" },
        },
        sizeSmall: {
          transform: "none",
          "&.MuiInputLabel-shrink": { transform: "none" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
          borderRadius: 6,
          color: theme.vars.palette.text.primary,
          fontSize: 13,
          lineHeight: "18px",
          minHeight: 32,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.vars.palette.divider,
            padding: 0,
            top: 0,
            transition: "border-color 120ms ease, box-shadow 120ms ease",
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
            borderColor: theme.vars.palette.line.strong,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.vars.palette.primary.main,
            borderWidth: 1,
            boxShadow: `0 0 0 3px ${theme.vars.palette.action.focus}`,
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.vars.palette.error.main,
          },
          "&.Mui-disabled": {
            backgroundColor: theme.vars.palette.surface.subtle,
          },
        }),
        input: ({ theme }) => ({
          backgroundColor: "transparent",
          height: "18px",
          padding: "7px 10px",
          "&::placeholder": {
            color: theme.vars.palette.text.disabled,
            opacity: 1,
          },
        }),
        multiline: {
          alignItems: "flex-start",
          minHeight: 72,
          padding: 0,
        },
        inputMultiline: {
          backgroundColor: "transparent",
          height: "auto",
          padding: "7px 10px",
        },
        sizeSmall: {
          minHeight: 28,
          "& .MuiOutlinedInput-input": { padding: "5px 8px" },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          minHeight: "18px",
          padding: "7px 32px 7px 10px",
        },
        icon: ({ theme }) => ({
          color: theme.vars.palette.text.secondary,
          fontSize: 18,
          right: 8,
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: 12,
          lineHeight: "16px",
          marginLeft: 0,
          marginRight: 0,
          marginTop: 2,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
          borderRadius: 8,
          boxShadow: theme.vars.palette.elevation.popover,
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { marginTop: 4, minWidth: 180 },
        list: { padding: 4 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 4,
          fontSize: 13,
          gap: 8,
          lineHeight: "18px",
          minHeight: 32,
          padding: "6px 8px",
          "& .MuiListItemIcon-root": {
            color: theme.vars.palette.text.secondary,
            minWidth: 0,
          },
          "& .MuiSvgIcon-root": { fontSize: 16 },
          "&:hover": { backgroundColor: theme.vars.palette.surface.hover },
          "&.Mui-focusVisible": {
            backgroundColor: theme.vars.palette.surface.hover,
          },
          "&.Mui-selected, &.Mui-selected.Mui-focusVisible": {
            backgroundColor: theme.vars.palette.accent.soft,
          },
          "&.Mui-selected:hover": {
            backgroundColor: theme.vars.palette.accent.softHover,
          },
          "&.MuiMenuItem-divider": {
            borderBottomColor: theme.vars.palette.divider,
            marginBottom: 4,
          },
        }),
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: { marginTop: 4 },
        listbox: ({ theme }) => ({
          padding: 4,
          "& .MuiAutocomplete-option": {
            borderRadius: 4,
            fontSize: 13,
            minHeight: 32,
            "&.Mui-focused": {
              backgroundColor: theme.vars.palette.surface.hover,
            },
            '&[aria-selected="true"]': {
              backgroundColor: theme.vars.palette.accent.soft,
            },
          },
        }),
        inputRoot: {
          paddingTop: 2,
          paddingBottom: 2,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 6,
          "&:hover": { backgroundColor: theme.vars.palette.surface.hover },
          "&.Mui-selected": {
            backgroundColor: theme.vars.palette.surface.active,
          },
          "&.Mui-selected:hover": {
            backgroundColor: theme.vars.palette.surface.active,
          },
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.vars.palette.text.secondary,
          minWidth: 28,
        }),
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: false, enterDelay: 300 },
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: theme.vars.palette.text.primary,
          borderRadius: 4,
          color: theme.vars.palette.background.paper,
          fontSize: 12,
          fontWeight: 500,
          padding: "4px 8px",
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 500,
          height: 22,
        },
        label: { paddingLeft: 6, paddingRight: 6 },
        sizeSmall: { height: 20, fontSize: 11 },
        outlined: ({ theme }) => ({
          borderColor: theme.vars.palette.divider,
        }),
        icon: { fontSize: 14, marginLeft: 6, marginRight: -2 },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 36 },
        indicator: ({ theme }) => ({
          backgroundColor: theme.vars.palette.text.primary,
          height: 2,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.vars.palette.text.secondary,
          fontSize: 13,
          fontWeight: 500,
          minHeight: 36,
          minWidth: 0,
          padding: "8px 2px",
          marginRight: 16,
          "&.Mui-selected": { color: theme.vars.palette.text.primary },
          "&:hover": { color: theme.vars.palette.text.primary },
        }),
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontSize: 12, fontWeight: 600 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({ borderColor: theme.vars.palette.divider }),
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.surface.active,
          borderRadius: 999,
          height: 4,
        }),
        bar: { borderRadius: 999 },
      },
    },
    MuiSkeleton: {
      defaultProps: { animation: "wave" },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.surface.hover,
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.vars.palette.surface.sidebar,
          borderColor: theme.vars.palette.divider,
        }),
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { padding: 8 },
        track: { borderRadius: 999 },
      },
    },
  },
});
