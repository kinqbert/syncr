import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { DashboardRepository } from "src/repositories/dashboard.repository";
import { RoleRepository } from "src/repositories/role.repository";

import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository, RoleRepository, JwtAuthGuard, AuthRepository],
})
export class DashboardModule {}
