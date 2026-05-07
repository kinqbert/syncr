import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { getErrorMessage } from "@/utils/getErrorMessage";

type EditableTextProps = {
  minRows?: number;
  multiline?: boolean;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  value: string;
  variant?: "h5" | "body1";
};

export const EditableText = ({
  minRows,
  multiline = false,
  onSave,
  placeholder = "Click to add",
  value,
  variant = "body1",
}: EditableTextProps) => {
  const [draft, setDraft] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const nextValue = draft.trim();

    if (nextValue === value.trim()) {
      setIsEditing(false);
      setError(null);

      return;
    }

    try {
      await onSave(nextValue);
      setIsEditing(false);
      setError(null);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Could not update task."));
    }
  };

  if (isEditing) {
    return (
      <TextField
        autoFocus
        error={Boolean(error)}
        fullWidth
        helperText={error}
        minRows={minRows}
        multiline={multiline}
        onBlur={() => void handleSave()}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !multiline) {
            event.preventDefault();
            void handleSave();
          }

          if (event.key === "Escape") {
            setDraft(value);
            setError(null);
            setIsEditing(false);
          }
        }}
        slotProps={{
          input: {
            disableUnderline: true,
          },
        }}
        sx={{
          mx: -1,
          "& .MuiInputBase-root": {
            borderRadius: 1,
            outline: "2px solid",
            outlineColor: error ? "error.main" : "divider",
            outlineOffset: "-1px",
            p: 0,
            typography: variant,
            "&.Mui-focused": {
              outlineColor: error ? "error.main" : "primary.main",
            },
          },
          "& .MuiInputBase-input": {
            height: "auto",
            lineHeight: "inherit",
            overflowWrap: "anywhere",
            px: 1,
            py: 0.75,
          },
        }}
        value={draft}
        variant="standard"
      />
    );
  }

  return (
    <Box
      onClick={() => {
        setDraft(value);
        setError(null);
        setIsEditing(true);
      }}
      sx={{
        borderRadius: 1,
        cursor: "text",
        mx: -1,
        px: 1,
        py: 0.75,
        transition: "background-color 160ms ease",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Typography
        color={value ? "text.primary" : "text.secondary"}
        sx={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
        variant={variant}
      >
        {value || placeholder}
      </Typography>
    </Box>
  );
};
