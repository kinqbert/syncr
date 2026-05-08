import { Module } from "@nestjs/common";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthRepository } from "../../repositories/auth.repository";
import { LabelsRepository } from "../../repositories/labels.repository";
import { ProjectsRepository } from "../../repositories/projects.repository";
import { RoleRepository } from "../../repositories/role.repository";
import { NotificationsModule } from "../notifications/notifications.module";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
  imports: [NotificationsModule],
  controllers: [ProjectsController],

  providers: [
    ProjectsService,
    JwtAuthGuard,
    AuthRepository,
    RoleRepository,
    ProjectsRepository,
    LabelsRepository,
  ],
})
export class ProjectsModule {}
