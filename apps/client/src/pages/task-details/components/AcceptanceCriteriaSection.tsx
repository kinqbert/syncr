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
    <Stack gap={1}>
      <Typography variant="caption">Acceptance Criteria</Typography>
      {criteria.map((criterion) => (
        <Stack
          alignItems="center"
          direction="row"
          gap={1}
          key={criterion.id}
          sx={{ minHeight: 36 }}
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
                disabled={isDeleting}
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
          placeholder="Add acceptance criterion"
          size="small"
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
