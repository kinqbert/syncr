import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import type { DashboardData } from "@syncr/packages";
import { CompanyId } from "src/common/decorators/company-id.decorator";
import { ProjectViewer } from "src/common/decorators/project-viewer.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PermissionGuard } from "src/common/guards/permission-guard.guard";

import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getDashboard(
    @CompanyId() companyId: number,
    @ProjectViewer() viewer: ProjectViewer,
  ): Promise<DashboardData> {
    return await this.dashboardService.getDashboard(companyId, viewer);
  }
}
