import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { UserId } from "src/common/decorators/user-id.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

import { CompanyDto } from "./company.dto";
import { CompanyService } from "./company.service";

@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMyCompanies(@UserId() userId: number): Promise<CompanyDto[]> {
    return await this.companyService.getUserCompanies(userId);
  }
}
