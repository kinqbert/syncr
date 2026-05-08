import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { TaskComment } from "@syncr/packages";
import { useState } from "react";

import { useCreateTaskComment, useGetTaskComments } from "@/api/tasks";
import { useProject } from "@/hooks";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { Panel } from "../../../components/Panel";

type TaskCommentsPanelProps = {
  taskId: number;
};

const getInitials = (author: TaskComment["author"]) => {
  if (!author) {
    return "?";
  }

  return `${author.name.at(0) ?? ""}${author.surname.at(0) ?? ""}`.toUpperCase();
};

const getAuthorName = (author: TaskComment["author"]) => {
  return author ? `${author.name} ${author.surname}`.trim() : "Deleted user";
};

export const TaskCommentsPanel = ({ taskId }: TaskCommentsPanelProps) => {
  const { projectId } = useProject();

  const { data: comments = [], isPending } = useGetTaskComments(
    projectId,
    taskId,
  );
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
    <Panel>
      <Stack gap={2}>
        <Stack alignItems="center" direction="row" gap={1}>
          <ChatBubbleOutlineIcon fontSize="small" />
          <Typography variant="subtitle1">Comments</Typography>
        </Stack>

        {error ? <Alert severity="error">{error}</Alert> : null}

        {isPending ? (
          <Stack alignItems="center" py={1}>
            <CircularProgress size={24} />
          </Stack>
        ) : null}

        {!isPending && comments.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            No comments yet.
          </Typography>
        ) : null}

        {comments.map((item) => (
          <Stack
            alignItems="flex-start"
            direction="row"
            gap={1.25}
            key={item.id}
          >
            <Avatar sx={{ height: 24, width: 24 }}>
              {getInitials(item.author)}
            </Avatar>
            <Stack minWidth={0}>
              <Stack
                alignItems="baseline"
                direction="row"
                flexWrap="wrap"
                gap={0.75}
              >
                <Typography variant="caption">
                  {getAuthorName(item.author)}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {formatRelativeDate(item.createdAt)}
                </Typography>
              </Stack>
              <Typography sx={{ whiteSpace: "pre-wrap" }} variant="body2">
                {item.content}
              </Typography>
            </Stack>
          </Stack>
        ))}

        <Divider />
        <Stack
          component="form"
          direction="row"
          gap={1.25}
          onSubmit={(event) => {
            event.preventDefault();
            void createComment();
          }}
        >
          <TextField
            disabled={createTaskComment.isPending}
            fullWidth
            minRows={2}
            multiline
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add a comment..."
            size="small"
            value={comment}
          />
          <Button
            disabled={createTaskComment.isPending || !comment.trim()}
            sx={{ alignSelf: "flex-start", whiteSpace: "nowrap" }}
            type="submit"
            variant="contained"
          >
            Post
          </Button>
        </Stack>
      </Stack>
    </Panel>
  );
};
