import { Company } from "@syncr/packages";
import { IsNumber, IsString } from "class-validator";

export class CompanyDto implements Company {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
