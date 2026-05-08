import { Module } from "@nestjs/common";

import { AuthRepository } from "../../repositories/auth.repository";
import { NotificationsGateway } from "./notifications.gateway";

@Module({
  providers: [NotificationsGateway, AuthRepository],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
