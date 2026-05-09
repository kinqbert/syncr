import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { TasksRepository } from "src/repositories/tasks.repository";

import { CalendarConnectionsRepository } from "../../repositories/calendar-connections.repository";
import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";
import { CalendarProviderRegistry } from "./calendar-provider.registry";
import { CalendarSyncService } from "./calendar-sync.service";
import { GoogleCalendarClient } from "./google-calendar.client";
import { TokenCryptoService } from "./token-crypto.service";

@Module({
  controllers: [CalendarController],
  providers: [
    CalendarConnectionsRepository,
    CalendarProviderRegistry,
    CalendarService,
    CalendarSyncService,
    GoogleCalendarClient,
    TokenCryptoService,
    JwtAuthGuard,
    AuthRepository,
    TasksRepository,
  ],
  exports: [CalendarSyncService],
})
export class CalendarModule {}
