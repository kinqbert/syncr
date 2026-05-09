import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";

import { CONFIG } from "../../config/configuration";
import { CalendarEventInput, CalendarProviderClient, CalendarTokenSet } from "./calendar.types";

type GoogleTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
};

@Injectable()
export class GoogleCalendarClient implements CalendarProviderClient {
  private readonly authBaseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  private readonly calendarBaseUrl = "https://www.googleapis.com/calendar/v3";
  private readonly tokenUrl = "https://oauth2.googleapis.com/token";
  private readonly userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
  private readonly scopes = ["openid", "email", "https://www.googleapis.com/auth/calendar.events"];

  getAuthorizationUrl(state: string) {
    this.ensureConfigured();

    const url = new URL(this.authBaseUrl);
    url.searchParams.set("client_id", CONFIG.GOOGLE_CALENDAR_CLIENT_ID!);
    url.searchParams.set("redirect_uri", CONFIG.GOOGLE_CALENDAR_REDIRECT_URI!);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", this.scopes.join(" "));
    url.searchParams.set("state", state);
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");
    url.searchParams.set("include_granted_scopes", "true");

    return url.toString();
  }

  async exchangeCode(code: string): Promise<CalendarTokenSet> {
    const tokens = await this.postToken({
      code,
      client_id: CONFIG.GOOGLE_CALENDAR_CLIENT_ID!,
      client_secret: CONFIG.GOOGLE_CALENDAR_CLIENT_SECRET!,
      redirect_uri: CONFIG.GOOGLE_CALENDAR_REDIRECT_URI!,
      grant_type: "authorization_code",
    });

    if (!tokens.refresh_token) {
      throw new BadRequestException("Google did not return a refresh token");
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: this.getExpiresAt(tokens.expires_in),
      accountEmail: await this.getAccountEmail(tokens.access_token),
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const tokens = await this.postToken({
      client_id: CONFIG.GOOGLE_CALENDAR_CLIENT_ID!,
      client_secret: CONFIG.GOOGLE_CALENDAR_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: this.getExpiresAt(tokens.expires_in),
    };
  }

  async createEvent(accessToken: string, calendarId: string, event: CalendarEventInput) {
    const response = await this.request<{ id: string }>(
      accessToken,
      `${this.calendarBaseUrl}/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        body: JSON.stringify(this.toGoogleEvent(event)),
      },
    );

    return response.id;
  }

  async updateEvent(
    accessToken: string,
    calendarId: string,
    eventId: string,
    event: CalendarEventInput,
  ) {
    await this.request(
      accessToken,
      `${this.calendarBaseUrl}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(this.toGoogleEvent(event)),
      },
    );
  }

  async deleteEvent(accessToken: string, calendarId: string, eventId: string) {
    await this.request(
      accessToken,
      `${this.calendarBaseUrl}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      { method: "DELETE" },
      [200, 204, 404, 410],
    );
  }

  private async postToken(body: Record<string, string>) {
    this.ensureConfigured();

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(body),
    });

    if (!response.ok) {
      throw new ServiceUnavailableException("Google token request failed");
    }

    return (await response.json()) as GoogleTokenResponse;
  }

  private async getAccountEmail(accessToken: string) {
    const response = await fetch(this.userInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { email?: string };

    return data.email ?? null;
  }

  private async request<T = unknown>(
    accessToken: string,
    url: string,
    init: RequestInit,
    okStatuses = [200, 201],
  ) {
    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    if (!okStatuses.includes(response.status)) {
      throw new ServiceUnavailableException("Google Calendar request failed");
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  private toGoogleEvent(event: CalendarEventInput) {
    return {
      summary: event.title,
      description: event.description,
      start: { date: event.startDate },
      end: { date: event.endDate },
      source: {
        title: "Syncr",
        url: event.url,
      },
      extendedProperties: {
        private: {
          syncrTaskId: String(event.taskId),
        },
      },
      transparency: "transparent",
    };
  }

  private getExpiresAt(expiresInSeconds: number) {
    return new Date(Date.now() + expiresInSeconds * 1000);
  }

  private ensureConfigured() {
    if (
      !CONFIG.GOOGLE_CALENDAR_CLIENT_ID ||
      !CONFIG.GOOGLE_CALENDAR_CLIENT_SECRET ||
      !CONFIG.GOOGLE_CALENDAR_REDIRECT_URI
    ) {
      throw new ServiceUnavailableException("Google Calendar integration is not configured");
    }
  }
}
