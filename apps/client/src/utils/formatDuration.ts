export const formatDuration = (minutes: number | null | undefined) => {
  if (minutes === null || minutes === undefined) {
    return "No estimate";
  }

  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hourLabel = hours === 1 ? "hour" : "hours";

  if (remainingMinutes === 0) {
    return `${hours} ${hourLabel}`;
  }

  const minuteLabel = remainingMinutes === 1 ? "minute" : "minutes";

  return `${hours} ${hourLabel} ${remainingMinutes} ${minuteLabel}`;
};
