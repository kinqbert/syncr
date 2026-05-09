import { CalendarProvider } from "@syncr/packages";

export type CalendarTask = {
  id: number;
  name: string;
  description: string;
  projectId: number;
  project?: {
    id: number;
    name: string;
  };
  endDate: Date | null;
  assignee: { id: number } | null;
};

export type CalendarTokenSet = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  accountEmail: string | null;
};

export type CalendarConnection = {
  id: number;
  userId: number;
  provider: CalendarProvider;
  calendarId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

export type CalendarEventInput = {
  taskId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  url: string;
};

export interface CalendarProviderClient {
  getAuthorizationUrl(state: string): string;
  exchangeCode(code: string): Promise<CalendarTokenSet>;
  refreshAccessToken(refreshToken: string): Promise<Omit<CalendarTokenSet, "accountEmail">>;
  createEvent(accessToken: string, calendarId: string, event: CalendarEventInput): Promise<string>;
  updateEvent(
    accessToken: string,
    calendarId: string,
    eventId: string,
    event: CalendarEventInput,
  ): Promise<void>;
  deleteEvent(accessToken: string, calendarId: string, eventId: string): Promise<void>;
}
