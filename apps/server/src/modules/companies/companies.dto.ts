import { Company, CreateCompanyBody, UserCompany } from "@syncr/packages";
import { IsNumber, IsString, MinLength } from "class-validator";

export class CompanyDto implements Company {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class UserCompanyDto extends CompanyDto implements UserCompany {
  @IsString()
  roleName: string;
}

export class CreateCompanyDto implements CreateCompanyBody {
  @IsString()
  @MinLength(2)
  name: string;
}
