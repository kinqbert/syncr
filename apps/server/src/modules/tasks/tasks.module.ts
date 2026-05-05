import { Module } from "@nestjs/common";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthRepository } from "../../repositories/auth.repository";
import { RoleRepository } from "../../repositories/role.repository";
import { TasksRepository } from "../../repositories/tasks.repository";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, JwtAuthGuard, AuthRepository, RoleRepository],
})
export class TasksModule {}
