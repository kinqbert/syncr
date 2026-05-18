import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { UserId } from "../../common/decorators/user-id.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  CompanyDto,
  CreateCompanyDto,
  UpdateCompanyUserSettingsDto,
  UserCompanyDto,
} from "./companies.dto";
import { CompaniesService } from "./companies.service";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMyCompanies(@UserId() userId: number): Promise<UserCompanyDto[]> {
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

  @Patch(":companyId/settings")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCompanyUserSettings(
    @UserId() userId: number,
    @Param("companyId", ParseIntPipe) companyId: number,
    @Body() updateCompanyUserSettingsDto: UpdateCompanyUserSettingsDto,
  ) {
    await this.companyService.updateUserCompanySettings(
      userId,
      companyId,
      updateCompanyUserSettingsDto,
    );
  }
}
