import { Box, Typography } from "@mui/material";

export type TypingUser = {
  id: number;
  name: string;
};

type TypingIndicatorProps = {
  users: TypingUser[];
};

const getTypingLabel = (users: TypingUser[]) => {
  if (users.length === 1) {
    return `${users[0].name} is typing...`;
  }

  if (users.length === 2) {
    return `${users[0].name} and ${users[1].name} are typing...`;
  }

  return `${users.length} people typing...`;
};

export const TypingIndicator = ({ users }: TypingIndicatorProps) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: 22,
        px: { xs: 1.5, sm: 2 },
        width: "100%",
      }}
    >
      <Typography
        color="text.secondary"
        fontSize={12}
        fontWeight={700}
        noWrap
        sx={{
          display: "inline-block",
          maxWidth: "100%",
        }}
      >
        {getTypingLabel(users)}
      </Typography>
    </Box>
  );
};
