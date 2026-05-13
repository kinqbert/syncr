import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { DashboardRepository } from "src/repositories/dashboard.repository";
import { UsersRepository } from "src/repositories/users.repository";

import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardRepository,
    UsersRepository,
    JwtAuthGuard,
    AuthRepository,
  ],
})
export class DashboardModule {}
