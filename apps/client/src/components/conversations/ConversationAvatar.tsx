import { Avatar } from "@mui/material";
import type { ListConversation } from "@syncr/packages";
import { ConversationType } from "@syncr/packages";
import { Users } from "lucide-mui";

import type { TintName } from "@/lib/theme";

const avatarTints: TintName[] = ["indigo", "green", "orange", "blue", "pink"];

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

  return avatarTints[seed % avatarTints.length];
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
  const tint = getAvatarColor(title);

  return (
    <Avatar
      sx={{
        bgcolor: `tint.${tint}.bg`,
        color: `tint.${tint}.fg`,
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
