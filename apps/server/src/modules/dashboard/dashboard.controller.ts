import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import type { DashboardData } from "@syncr/packages";
import { CompanyId } from "src/common/decorators/company-id.decorator";
import { UserId } from "src/common/decorators/user-id.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getDashboard(
    @CompanyId() companyId: number,
    @UserId() userId: number,
  ): Promise<DashboardData> {
    return await this.dashboardService.getDashboard(companyId, userId);
  }
}
