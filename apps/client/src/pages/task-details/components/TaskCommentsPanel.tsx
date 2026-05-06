import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  Avatar,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Panel } from "../../../components/Panel";

const comments = [
  "This looks great! Let's make sure we test all edge cases.",
  "I've completed the initial implementation. Ready for review.",
  "Do we need to update the documentation for this change?",
];

const commentAuthors = ["Sarah Chen", "Mike Johnson", "Emily Davis"];
const commentInitials = ["SC", "MJ", "ED"];

export const TaskCommentsPanel = () => {
  return (
    <Panel>
      <Stack gap={2}>
        <Stack alignItems="center" direction="row" gap={1}>
          <ChatBubbleOutlineIcon fontSize="small" />
          <Typography variant="subtitle1">Comments</Typography>
        </Stack>
        {comments.map((comment, index) => (
          <Stack
            alignItems="flex-start"
            direction="row"
            gap={1.25}
            key={comment}
          >
            <Avatar sx={{ height: 24, width: 24 }}>
              {commentInitials[index]}
            </Avatar>
            <Stack>
              <Typography variant="caption">{commentAuthors[index]}</Typography>
              <Typography variant="body2">{comment}</Typography>
            </Stack>
          </Stack>
        ))}
        <Divider />
        <Stack direction="row" gap={1.25}>
          <Avatar sx={{ height: 28, width: 28 }}>JD</Avatar>
          <TextField
            fullWidth
            minRows={2}
            multiline
            placeholder="Add a comment..."
            size="small"
          />
        </Stack>
        <Button sx={{ alignSelf: "flex-end" }} variant="contained">
          Post Comment
        </Button>
      </Stack>
    </Panel>
  );
};
