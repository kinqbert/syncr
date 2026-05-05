import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { RoleRepository } from "src/repositories/role.repository";
import { TasksRepository } from "src/repositories/tasks.repository";

import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    JwtAuthGuard,
    AuthRepository,
    RoleRepository,
  ],
})
export class TasksModule {}
