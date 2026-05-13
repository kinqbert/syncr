import { Avatar } from "@mui/material";
import type { ListConversation } from "@syncr/packages";
import { ConversationType } from "@syncr/packages";
import { Users } from "lucide-mui";

const avatarColors = [
  { bg: "#EEF2FF", color: "#4338CA" },
  { bg: "#ECFDF5", color: "#047857" },
  { bg: "#FFF7ED", color: "#C2410C" },
  { bg: "#EFF6FF", color: "#1D4ED8" },
  { bg: "#FDF2F8", color: "#BE185D" },
];

const getNameInitials = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  return (
    parts
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "?"
  );
};

const getAvatarColor = (value: string) => {
  const seed = value
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return avatarColors[seed % avatarColors.length];
};

type ConversationAvatarProps = {
  size?: number;
  title: string;
  type: ListConversation["type"];
};

export const ConversationAvatar = ({
  size = 40,
  title,
  type,
}: ConversationAvatarProps) => {
  const colors = getAvatarColor(title);

  return (
    <Avatar
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        flex: "0 0 auto",
        fontSize: Math.max(12, Math.round(size * 0.35)),
        fontWeight: 800,
        height: size,
        width: size,
      }}
    >
      {type === ConversationType.Group && !title ? (
        <Users fontSize="small" />
      ) : (
        getNameInitials(title)
      )}
    </Avatar>
  );
};
