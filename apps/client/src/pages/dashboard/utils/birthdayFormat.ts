export const formatBirthday = (birthday: string) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${birthday}T00:00:00`));
};

export const getBirthdayCountdownLabel = (daysRemaining: number) => {
  if (daysRemaining === 0) {
    return "Today";
  }

  if (daysRemaining === 1) {
    return "Tomorrow";
  }

  return `${daysRemaining} days`;
};
