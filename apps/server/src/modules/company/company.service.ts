import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { CompanyRepository } from "src/repositories/company.repository";

import { CompanyDto, CreateCompanyDto } from "./company.dto";
import { mapCompanyToDto } from "./company.mapper";

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async getUserCompanies(userId: number): Promise<CompanyDto[]> {
    return await this.companyRepository.getUserCompanies(userId);
  }

  async createUserCompany(
    userId: number,
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyDto> {
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
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    );
  }
}
