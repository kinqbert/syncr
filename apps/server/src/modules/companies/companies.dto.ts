import type {
  Company,
  CreateCompanyBody,
  UpdateCompanyUserSettingsBody,
  UserCompany,
} from "@syncr/packages";
import { IsInt, IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CompanyDto implements Company {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class UserCompanyDto extends CompanyDto implements UserCompany {
  @IsString()
  roleName: string;

  @IsNumber()
  weeklyLoadMinutes: number;
}

export class CreateCompanyDto implements CreateCompanyBody {
  @IsString()
  @MinLength(2)
  name: string;
}

export class UpdateCompanyUserSettingsDto implements UpdateCompanyUserSettingsBody {
  @IsInt()
  @Min(60)
  @Max(10080)
  weeklyLoadMinutes: number;
}
