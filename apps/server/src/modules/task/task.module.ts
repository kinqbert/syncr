import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { RoleRepository } from "src/repositories/role.repository";
import { TaskRepository } from "src/repositories/task.repository";

import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    TaskRepository,
    JwtAuthGuard,
    AuthRepository,
    RoleRepository,
  ],
})
export class TaskModule {}
