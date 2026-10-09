import { Stack } from "@mui/material";
import type { DashboardBirthday } from "@syncr/packages";
import { Cake } from "lucide-mui";

import { EmptyState, ListRow, Section } from "@/components/ui";
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
    <Section icon={<Cake />} padding="none" title="Upcoming birthdays">
      {birthdays.length === 0 ? (
        <EmptyState
          compact
          description="Team members can add a birthday in Settings."
          title="No birthdays yet"
        />
      ) : (
        <Stack sx={{ maxHeight: 280, overflowY: "auto", p: 1 }}>
          {birthdays.map((birthday) => (
            <ListRow
              key={birthday.userId}
              leading={
                <UserAvatar
                  name={birthday.name}
                  size={22}
                  surname={birthday.surname}
                />
              }
              title={getUserFullName(birthday.name, birthday.surname)}
              trailing={
                <Stack
                  component="span"
                  direction="row"
                  gap={1}
                  sx={{
                    color:
                      birthday.daysRemaining <= 7 ? "accent.text" : undefined,
                  }}
                >
                  <span>{formatBirthday(birthday.birthday)}</span>
                  <span>·</span>
                  <span>{getBirthdayCountdownLabel(birthday.daysRemaining)}</span>
                </Stack>
              }
            />
          ))}
        </Stack>
      )}
    </Section>
  );
};
