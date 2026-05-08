import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { UserCompany } from "@syncr/packages";

import { CompaniesRepository } from "../../repositories/companies.repository";
import { CompanyDto, CreateCompanyDto } from "./companies.dto";
import { mapCompanyToDto, mapUserCompanyToDto } from "./companies.mapper";

@Injectable()
export class CompaniesService {
  constructor(private readonly companyRepository: CompaniesRepository) {}

  async getUserCompanies(userId: number): Promise<UserCompany[]> {
    const userCompanies = await this.companyRepository.getUserCompanies(userId);

    return userCompanies.map(mapUserCompanyToDto);
  }

  async createUserCompany(userId: number, createCompanyDto: CreateCompanyDto): Promise<CompanyDto> {
    const companyName = createCompanyDto.name.trim();

    if (companyName.length < 2) {
      throw new BadRequestException("Company name must be at least 2 characters long");
    }

    try {
      const company = await this.companyRepository.createUserCompany(userId, companyName);

      return mapCompanyToDto(company);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException("Company with such name already exists");
      }

      throw error;
    }
  }

  private isUniqueViolation(error: unknown) {
    return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
  }
}
