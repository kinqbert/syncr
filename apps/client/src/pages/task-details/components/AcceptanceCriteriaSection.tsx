import {
  Box,
  Checkbox,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type {
  TaskAcceptanceCriterion,
  UpdateTaskAcceptanceCriterionBody,
} from "@syncr/packages";
import { Plus, Trash2 } from "lucide-mui";
import { useState } from "react";

import { EditableText } from "../../../components/EditableText";

type AcceptanceCriteriaSectionProps = {
  criteria: TaskAcceptanceCriterion[];
  isCreating: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  onCreate: (description: string) => Promise<void>;
  onDelete: (criterionId: number) => Promise<void>;
  onUpdate: (
    criterionId: number,
    body: UpdateTaskAcceptanceCriterionBody,
  ) => Promise<void>;
};

export const AcceptanceCriteriaSection = ({
  criteria,
  isCreating,
  isDeleting,
  isUpdating,
  onCreate,
  onDelete,
  onUpdate,
}: AcceptanceCriteriaSectionProps) => {
  const [newCriterion, setNewCriterion] = useState("");

  const addCriterion = async () => {
    const description = newCriterion.trim();

    if (!description) {
      return;
    }

    await onCreate(description);
    setNewCriterion("");
  };

  return (
    <Stack gap={0.5}>
      <Stack alignItems="baseline" direction="row" gap={1} sx={{ mb: 0.5 }}>
        <Typography component="h2" variant="h6">
          Acceptance criteria
        </Typography>
        {criteria.length > 0 && (
          <Typography color="text.secondary" variant="body2">
            {criteria.filter((criterion) => criterion.isDone).length} of{" "}
            {criteria.length} done
          </Typography>
        )}
      </Stack>
      {criteria.map((criterion) => (
        <Stack
          alignItems="center"
          direction="row"
          gap={1}
          key={criterion.id}
          sx={{
            minHeight: 32,
            "&:hover .criterion-remove, &:focus-within .criterion-remove": {
              opacity: 1,
            },
          }}
        >
          <Checkbox
            checked={criterion.isDone}
            disabled={isUpdating}
            onChange={(event) =>
              void onUpdate(criterion.id, {
                isDone: event.target.checked,
              })
            }
            size="small"
            sx={{ p: 0.25 }}
          />
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              color: criterion.isDone ? "text.secondary" : "text.primary",
              textDecoration: criterion.isDone ? "line-through" : "none",
            }}
          >
            <EditableText
              onSave={(description) => {
                if (!description) {
                  throw new Error("Acceptance criterion is required.");
                }

                return onUpdate(criterion.id, { description });
              }}
              value={criterion.description}
            />
          </Box>
          <Tooltip title="Remove criterion">
            <span>
              <IconButton
                aria-label="Remove criterion"
                className="criterion-remove"
                disabled={isDeleting}
                sx={{ opacity: { xs: 1, md: 0 } }}
                onClick={() => void onDelete(criterion.id)}
                size="small"
              >
                <Trash2 fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ))}
      <Stack
        component="form"
        direction="row"
        gap={1}
        onSubmit={(event) => {
          event.preventDefault();
          void addCriterion();
        }}
      >
        <TextField
          fullWidth
          onChange={(event) => setNewCriterion(event.target.value)}
          placeholder="Add a criterion and press Enter"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root:not(.Mui-focused)": {
              bgcolor: "transparent",
            },
            "& .MuiOutlinedInput-root:not(.Mui-focused):not(:hover) .MuiOutlinedInput-notchedOutline":
              { borderStyle: "dashed" },
          }}
          value={newCriterion}
        />
        <Tooltip title="Add criterion">
          <span>
            <IconButton
              aria-label="Add criterion"
              color="primary"
              disabled={isCreating || !newCriterion.trim()}
              type="submit"
            >
              <Plus />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
