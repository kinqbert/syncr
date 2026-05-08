import { Module } from "@nestjs/common";
import { NotificationsRepository } from "src/repositories/notifications.repository";
import { ProjectsRepository } from "src/repositories/projects.repository";
import { TasksRepository } from "src/repositories/tasks.repository";

import { AuthRepository } from "../../repositories/auth.repository";
import { NotificationsGateway } from "./notifications.gateway";
import { NotificationsService } from "./notifications.service";

@Module({
  providers: [
    NotificationsGateway,
    AuthRepository,
    NotificationsService,
    NotificationsRepository,
    TasksRepository,
    ProjectsRepository,
  ],
  exports: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}
