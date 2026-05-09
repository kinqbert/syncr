import { BadRequestException, Injectable } from "@nestjs/common";
import { CalendarProvider } from "@syncr/packages";

import { CalendarProviderClient } from "./calendar.types";
import { GoogleCalendarClient } from "./google-calendar.client";

@Injectable()
export class CalendarProviderRegistry {
  private readonly clients: Partial<Record<CalendarProvider, CalendarProviderClient>>;

  constructor(private readonly googleCalendarClient: GoogleCalendarClient) {
    this.clients = {
      [CalendarProvider.Google]: this.googleCalendarClient,
    };
  }

  getClient(provider: CalendarProvider): CalendarProviderClient {
    const client = this.clients[provider];

    if (!client) {
      throw new BadRequestException("Unsupported calendar provider");
    }

    return client;
  }

  isSupported(provider: string): provider is CalendarProvider {
    return provider in this.clients;
  }
}
