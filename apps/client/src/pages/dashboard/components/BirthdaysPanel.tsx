import { Paper, Stack, Typography } from "@mui/material";
import type { DashboardBirthday } from "@syncr/packages";
import { Cake } from "lucide-mui";

import { UserAvatar } from "@/components/UserAvatar";
import { getUserFullName } from "@/utils/getUserFullName";

import {
  formatBirthday,
  getBirthdayCountdownLabel,
} from "../utils/birthdayFormat";

type BirthdaysPanelProps = {
  birthdays: DashboardBirthday[];
};

export const BirthdaysPanel = ({ birthdays }: BirthdaysPanelProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack gap={2.5} minHeight={0}>
        <Stack alignItems="center" direction="row" gap={1}>
          <Cake sx={{ color: "primary.main", fontSize: 20 }} />
          <Typography fontSize={18} fontWeight={800}>
            Birthdays
          </Typography>
        </Stack>

        {birthdays.length === 0 ? (
          <Typography color="text.secondary">
            No birthdays added by team members yet.
          </Typography>
        ) : (
          <Stack
            gap={1.25}
            sx={{
              maxHeight: { xs: 280, sm: 330 },
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {birthdays.map((birthday) => (
              <Stack
                key={birthday.userId}
                alignItems="center"
                direction="row"
                gap={1.5}
                minWidth={0}
              >
                <UserAvatar
                  name={birthday.name}
                  size={34}
                  surname={birthday.surname}
                />
                <Stack minWidth={0} flex={1}>
                  <Typography fontSize={14} fontWeight={500} noWrap>
                    {getUserFullName(birthday.name, birthday.surname)}
                  </Typography>
                  <Typography color="text.secondary" fontSize={12}>
                    {formatBirthday(birthday.birthday)}
                  </Typography>
                </Stack>
                <Typography
                  color={
                    birthday.daysRemaining <= 7
                      ? "primary.main"
                      : "text.secondary"
                  }
                  fontSize={13}
                  fontWeight={600}
                  whiteSpace="nowrap"
                >
                  {getBirthdayCountdownLabel(birthday.daysRemaining)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
