import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import type { ConversationMessageReply } from "@syncr/packages";
import { Reply } from "lucide-mui";
import { useRef, useState } from "react";

import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

type MessageBubbleProps = {
  content: string;
  highlighted?: boolean;
  isFirstInBlock: boolean;
  isOwn: boolean;
  onReply: () => void;
  onReplyClick: (messageId: number) => void;
  replyTo: ConversationMessageReply | null;
};

const getBubbleRadius = (isOwn: boolean, isFirstInBlock: boolean) => {
  if (isOwn) {
    return isFirstInBlock ? "12px 12px 4px 12px" : "12px 4px 4px 12px";
  }

  return isFirstInBlock ? "12px 12px 12px 4px" : "4px 12px 12px 4px";
};

export const MessageBubble = ({
  content,
  highlighted = false,
  isFirstInBlock,
  isOwn,
  onReply,
  onReplyClick,
  replyTo,
}: MessageBubbleProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const touchMovedRef = useRef(false);
  const isTouchDevice = useIsTouchDevice();

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current == null) {
      return;
    }

    window.clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    if (!isTouchDevice) {
      return;
    }

    touchMovedRef.current = false;
    clearLongPressTimer();

    const target = event.currentTarget;

    longPressTimerRef.current = window.setTimeout(() => {
      if (touchMovedRef.current) {
        return;
      }

      setMenuAnchor(target);
      longPressTimerRef.current = null;
    }, 520);
  };

  const handleTouchMove = () => {
    touchMovedRef.current = true;
    clearLongPressTimer();
  };

  const handleTouchEnd = () => {
    clearLongPressTimer();
  };

  const handleReplyFromMenu = () => {
    setMenuAnchor(null);
    onReply();
  };

  return (
    <Stack
      alignItems={isOwn ? "flex-end" : "flex-start"}
      direction={isOwn ? "row-reverse" : "row"}
      gap={0.5}
      sx={
        isTouchDevice
          ? undefined
          : {
              "&:hover .message-reply-button": {
                opacity: 1,
              },
            }
      }
    >
      <Box
        onTouchCancel={handleTouchEnd}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        sx={{
          bgcolor: isOwn ? "primary.main" : "background.paper",
          border: highlighted ? "2px solid" : isOwn ? 0 : "1px solid",
          borderColor: highlighted ? "warning.main" : "divider",
          borderRadius: getBubbleRadius(isOwn, isFirstInBlock),
          color: isOwn ? "primary.contrastText" : "text.primary",
          px: { xs: 1.25, sm: 1.5 },
          py: { xs: 0.875, sm: 1 },
          transition: "border-color 160ms ease, border-width 160ms ease",
        }}
      >
        {replyTo ? (
          <Box
            component="button"
            onClick={() => onReplyClick(replyTo.id)}
            type="button"
            sx={{
              bgcolor: isOwn ? "inverse.overlay" : "surface.subtle",
              border: 0,
              borderLeft: "3px solid",
              borderColor: isOwn ? "primary.contrastText" : "primary.main",
              borderRadius: 1,
              color: "inherit",
              cursor: "pointer",
              display: "block",
              mb: 0.75,
              maxWidth: 320,
              px: 1,
              py: 0.75,
              textAlign: "left",
              width: "100%",
            }}
          >
            <Typography fontSize={12} fontWeight={600} noWrap>
              {replyTo.author
                ? `${replyTo.author.name} ${replyTo.author.surname}`.trim()
                : "Deleted user"}
            </Typography>
            <Typography fontSize={12} noWrap sx={{ opacity: 0.82 }}>
              {replyTo.content}
            </Typography>
          </Box>
        ) : null}
        <Typography
          sx={{
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </Typography>
      </Box>
      <IconButton
        aria-label="Reply"
        className="message-reply-button"
        onClick={onReply}
        size="small"
        sx={{
          alignSelf: "center",
          color: "text.secondary",
          display: isTouchDevice ? "none" : "inline-flex",
          height: 28,
          opacity: 0,
          transition: "opacity 120ms ease",
          width: 28,
        }}
      >
        <Reply fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={handleReplyFromMenu}>
          <Reply />
          Reply
        </MenuItem>
      </Menu>
    </Stack>
  );
};
