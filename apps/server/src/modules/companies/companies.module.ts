import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { CompaniesRepository } from "src/repositories/companies.repository";

import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";

@Module({
  providers: [CompaniesService, CompaniesRepository, JwtAuthGuard, AuthRepository],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
