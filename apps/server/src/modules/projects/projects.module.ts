import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { ProjectsRepository } from "src/repositories/projects.repository";
import { RoleRepository } from "src/repositories/role.repository";

import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
  controllers: [ProjectsController],

  providers: [ProjectsService, JwtAuthGuard, AuthRepository, RoleRepository, ProjectsRepository],
})
export class ProjectsModule {}
