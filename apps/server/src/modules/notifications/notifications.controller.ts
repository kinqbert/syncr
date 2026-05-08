import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { NotificationPayload } from "@syncr/packages";
import { UserId } from "src/common/decorators/user-id.decorator";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getNotifications(@UserId() userId: number): Promise<NotificationPayload[]> {
    return await this.notificationsService.getUserNotifications(userId);
  }

  @Patch(":notificationId/read")
  @HttpCode(HttpStatus.OK)
  async markNotificationAsRead(
    @UserId() userId: number,
    @Param("notificationId", ParseIntPipe) notificationId: number,
  ): Promise<NotificationPayload> {
    return await this.notificationsService.markNotificationAsRead(userId, notificationId);
  }

  @Patch("read")
  @HttpCode(HttpStatus.OK)
  async markAllNotificationsRead(@UserId() userId: number): Promise<NotificationPayload[]> {
    return await this.notificationsService.markAllUserNotificationsRead(userId);
  }
}
