import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { RoleRepository } from "src/repositories/role.repository";
import { TasksRepository } from "src/repositories/tasks.repository";
import { UsersRepository } from "src/repositories/users.repository";

import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  providers: [
    TeamService,
    JwtAuthGuard,
    AuthRepository,
    RoleRepository,
    UsersRepository,
    TasksRepository,
  ],
  controllers: [TeamController],
})
export class TeamModule {}
