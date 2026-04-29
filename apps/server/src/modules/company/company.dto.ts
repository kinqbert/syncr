import { Company, CreateCompanyBody } from "@syncr/packages";
import { IsNumber, IsString, MinLength } from "class-validator";

export class CompanyDto implements Company {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class CreateCompanyDto implements CreateCompanyBody {
  @IsString()
  @MinLength(2)
  name: string;
}
