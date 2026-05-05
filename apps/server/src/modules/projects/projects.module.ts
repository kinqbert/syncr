import { Module } from "@nestjs/common";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthRepository } from "../../repositories/auth.repository";
import { ProjectsRepository } from "../../repositories/projects.repository";
import { RoleRepository } from "../../repositories/role.repository";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
  controllers: [ProjectsController],

  providers: [ProjectsService, JwtAuthGuard, AuthRepository, RoleRepository, ProjectsRepository],
})
export class ProjectsModule {}
