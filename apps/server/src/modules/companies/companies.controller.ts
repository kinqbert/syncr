import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UserId } from "src/common/decorators/user-id.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

import { CompanyDto, CreateCompanyDto } from "./companies.dto";
import { CompaniesService } from "./companies.service";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

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
