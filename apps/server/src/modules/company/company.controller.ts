import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UserId } from "src/common/decorators/user-id.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

import { CompanyDto, CreateCompanyDto } from "./company.dto";
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

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createCompany(
    @UserId() userId: number,
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyDto> {
    return await this.companyService.createUserCompany(userId, createCompanyDto);
  }
}
