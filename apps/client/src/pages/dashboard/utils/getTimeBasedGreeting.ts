const GREETINGS_BY_PERIOD = {
  morning: [
    "Good morning",
    "Morning, welcome back",
    "Good morning, let's get synced",
  ],
  afternoon: [
    "Good afternoon",
    "Afternoon, welcome back",
    "Good afternoon, here's the latest",
  ],
  evening: [
    "Good evening",
    "Evening, welcome back",
    "Good evening, let's review the day",
  ],
  night: ["Working late?", "Good night", "Late check-in"],
} as const;

const getGreetingPeriod = (date: Date): keyof typeof GREETINGS_BY_PERIOD => {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 17) {
    return "afternoon";
  }

  if (hour >= 17 && hour < 22) {
    return "evening";
  }

  return "night";
};

export const getTimeBasedGreeting = (date: Date) => {
  const greetings = GREETINGS_BY_PERIOD[getGreetingPeriod(date)];
  const variantIndex = Math.floor(Math.random() * greetings.length);

  return greetings[variantIndex];
};
