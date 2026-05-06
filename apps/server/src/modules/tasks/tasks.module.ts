import { Module } from "@nestjs/common";
import { TaskCommentsRepository } from "src/repositories/task-comments.repository";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AcceptanceCriteriaRepository } from "../../repositories/acceptance-criteria.repository";
import { AuthRepository } from "../../repositories/auth.repository";
import { RoleRepository } from "../../repositories/role.repository";
import { TasksRepository } from "../../repositories/tasks.repository";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    TaskCommentsRepository,
    AcceptanceCriteriaRepository,
    JwtAuthGuard,
    AuthRepository,
    RoleRepository,
  ],
})
export class TasksModule {}
