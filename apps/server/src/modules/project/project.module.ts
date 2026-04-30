import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { ProjectRepository } from "src/repositories/project.repository";
import { RoleRepository } from "src/repositories/role.repository";

import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({
  controllers: [ProjectController],

  providers: [ProjectService, JwtAuthGuard, AuthRepository, RoleRepository, ProjectRepository],
})
export class ProjectModule {}
