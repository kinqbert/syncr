import { Module } from "@nestjs/common";
import { TaskActivitiesRepository } from "src/repositories/task-activities.repository";
import { TaskCommentsRepository } from "src/repositories/task-comments.repository";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AcceptanceCriteriaRepository } from "../../repositories/acceptance-criteria.repository";
import { AuthRepository } from "../../repositories/auth.repository";
import { LabelsRepository } from "../../repositories/labels.repository";
import { RoleRepository } from "../../repositories/role.repository";
import { TasksRepository } from "../../repositories/tasks.repository";
import { UsersRepository } from "../../repositories/users.repository";
import { NotificationsModule } from "../notifications/notifications.module";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

@Module({
  imports: [NotificationsModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    TaskActivitiesRepository,
    TaskCommentsRepository,
    AcceptanceCriteriaRepository,
    LabelsRepository,
    UsersRepository,
    JwtAuthGuard,
    AuthRepository,
    RoleRepository,
  ],
})
export class TasksModule {}
