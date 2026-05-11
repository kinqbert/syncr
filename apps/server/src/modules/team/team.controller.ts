import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { PermissionKey } from "@syncr/packages";
import { CompanyId } from "src/common/decorators/company-id.decorator";
import { RequirePermission } from "src/common/decorators/require-permission.decorator";
import { UserId } from "src/common/decorators/user-id.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PermissionGuard } from "src/common/guards/permission-guard.guard";

import { TeamService } from "./team.service";

@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @RequirePermission(PermissionKey.TeamView)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getTeamData(@CompanyId() companyId: number, @UserId() userId: number) {
    return await this.teamService.getCompanyTeamData(companyId, userId);
  }

  @Get("members")
  @RequirePermission(PermissionKey.TeamView)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  async getTeamMembers(@CompanyId() companyId: number, @UserId() userId: number) {
    return await this.teamService.getTeamMembers(companyId, userId);
  }
}
