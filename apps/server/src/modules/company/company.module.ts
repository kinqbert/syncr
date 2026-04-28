import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthRepository } from "src/repositories/auth.repository";
import { CompanyRepository } from "src/repositories/company.repository";

import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";

@Module({
  providers: [CompanyService, CompanyRepository, JwtAuthGuard, AuthRepository],
  controllers: [CompanyController],
})
export class CompanyModule {}
