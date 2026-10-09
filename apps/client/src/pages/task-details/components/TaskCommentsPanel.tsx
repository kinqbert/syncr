import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { TaskComment } from "@syncr/packages";
import { MessageCircle } from "lucide-mui";
import { useState } from "react";

import { useCreateTaskComment, useGetTaskComments } from "@/api/tasks";
import { RowSkeleton, Section } from "@/components/ui";
import { UserAvatar } from "@/components/UserAvatar";
import { useProject } from "@/hooks";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { getErrorMessage } from "@/utils/getErrorMessage";

type TaskCommentsPanelProps = {
  taskId: number;
};

const getAuthorName = (author: TaskComment["author"]) => {
  return author ? `${author.name} ${author.surname}`.trim() : "Deleted user";
};

export const TaskCommentsPanel = ({ taskId }: TaskCommentsPanelProps) => {
  const { projectId } = useProject();

  const {
    data: comments = [],
    error: commentsError,
    isError: areCommentsError,
    isPending,
  } = useGetTaskComments(projectId, taskId);
  const createTaskComment = useCreateTaskComment();
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createComment = async () => {
    const content = comment.trim();

    if (!content) {
      return;
    }

    setError(null);

    try {
      await createTaskComment.mutateAsync({
        projectId,
        taskId,
        body: { content },
      });

      setComment("");
    } catch (createError) {
      setError(getErrorMessage(createError, "Could not post comment."));
    }
  };

  return (
    <Section
      icon={<MessageCircle />}
      title={comments.length > 0 ? `Comments · ${comments.length}` : "Comments"}
    >
      <Stack gap={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}

        {areCommentsError ? (
          <Alert severity="error">
            {getErrorMessage(commentsError, "Could not load comments.")}
          </Alert>
        ) : null}

        {isPending ? <RowSkeleton count={2} /> : null}

        {!areCommentsError &&
          comments.map((item) => (
            <Stack
              alignItems="flex-start"
              direction="row"
              gap={1.25}
              key={item.id}
            >
              <UserAvatar
                name={item.author?.name}
                size={22}
                surname={item.author?.surname}
              />
              <Stack gap={0.25} minWidth={0}>
                <Stack alignItems="baseline" direction="row" gap={0.75}>
                  <Typography fontWeight={600}>
                    {getAuthorName(item.author)}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {formatRelativeDate(item.createdAt)}
                  </Typography>
                </Stack>
                <Typography sx={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>
                  {item.content}
                </Typography>
              </Stack>
            </Stack>
          ))}

        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            void createComment();
          }}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1.5,
            "&:focus-within": { borderColor: "primary.main" },
          }}
        >
          <TextField
            disabled={createTaskComment.isPending}
            fullWidth
            minRows={2}
            multiline
            onChange={(event) => setComment(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                void createComment();
              }
            }}
            placeholder={
              comments.length === 0 ? "Start the discussion…" : "Leave a comment…"
            }
            sx={{
              "& .MuiOutlinedInput-root": { bgcolor: "transparent" },
              "& .MuiOutlinedInput-notchedOutline": { border: 0 },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                boxShadow: "none",
              },
            }}
            value={comment}
          />
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            gap={1}
            sx={{ px: 1, pb: 1 }}
          >
            <Typography color="text.disabled" variant="body2">
              ⌘ Enter to send
            </Typography>
            <Button
              disabled={createTaskComment.isPending || !comment.trim()}
              size="small"
              type="submit"
              variant="contained"
            >
              Comment
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Section>
  );
};
