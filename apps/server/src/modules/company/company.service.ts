import { Injectable } from "@nestjs/common";
import { CompanyRepository } from "src/repositories/company.repository";

import { CompanyDto } from "./company.dto";

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async getUserCompanies(userId: number): Promise<CompanyDto[]> {
    return await this.companyRepository.getUserCompanies(userId);
  }
}
