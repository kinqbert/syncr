import { Module } from "@nestjs/common";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthRepository } from "../../repositories/auth.repository";
import { CompaniesRepository } from "../../repositories/companies.repository";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";

@Module({
  providers: [CompaniesService, CompaniesRepository, JwtAuthGuard, AuthRepository],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
