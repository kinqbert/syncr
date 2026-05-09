import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Redirect,
  UseGuards,
} from "@nestjs/common";
import { CalendarConnection, CalendarProvider } from "@syncr/packages";

import { UserId } from "../../common/decorators/user-id.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CONFIG } from "../../config/configuration";
import { CalendarService } from "./calendar.service";

@Controller("calendar-connections")
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getConnections(@UserId() userId: number): Promise<CalendarConnection[]> {
    return await this.calendarService.getConnections(userId);
  }

  @Get(":provider/connect")
  @UseGuards(JwtAuthGuard)
  @Redirect()
  connect(@UserId() userId: number, @Param("provider") provider: CalendarProvider) {
    return {
      url: this.calendarService.getAuthorizationUrl(userId, provider),
    };
  }

  @Get(":provider/callback")
  @Redirect()
  async callback(
    @Param("provider") provider: CalendarProvider,
    @Query("code") code: string,
    @Query("state") state: string,
  ) {
    await this.calendarService.completeOAuth(provider, code, state);

    return { url: `${CONFIG.CLIENT_URL}/settings?calendarConnected=${provider}` };
  }

  @Delete(":provider")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async disconnect(@UserId() userId: number, @Param("provider") provider: CalendarProvider) {
    await this.calendarService.disconnect(userId, provider);
  }
}
