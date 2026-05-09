export const CalendarProvider = {
  Google: "google",
} as const;

export type CalendarProvider =
  (typeof CalendarProvider)[keyof typeof CalendarProvider];

export type CalendarConnection = {
  id: number;
  provider: CalendarProvider;
  providerAccountEmail: string | null;
  calendarId: string;
  createdAt: string;
  updatedAt: string;
};
