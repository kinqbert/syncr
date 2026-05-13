import { Box, Typography } from "@mui/material";

type MessageBubbleProps = {
  content: string;
  isFirstInBlock: boolean;
  isOwn: boolean;
};

const getBubbleRadius = (isOwn: boolean, isFirstInBlock: boolean) => {
  if (isOwn) {
    return isFirstInBlock ? "16px 16px 4px 16px" : "16px 4px 4px 16px";
  }

  return isFirstInBlock ? "16px 16px 16px 4px" : "4px 16px 16px 4px";
};

export const MessageBubble = ({
  content,
  isFirstInBlock,
  isOwn,
}: MessageBubbleProps) => {
  return (
    <Box
      sx={{
        bgcolor: isOwn ? "primary.main" : "background.paper",
        border: isOwn ? 0 : "1px solid",
        borderColor: "divider",
        borderRadius: getBubbleRadius(isOwn, isFirstInBlock),
        color: isOwn ? "primary.contrastText" : "text.primary",
        px: 1.5,
        py: 1,
      }}
    >
      <Typography
        sx={{
          overflowWrap: "anywhere",
          whiteSpace: "pre-wrap",
        }}
      >
        {content}
      </Typography>
    </Box>
  );
};
