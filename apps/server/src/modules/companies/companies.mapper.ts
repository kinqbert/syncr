import { companies } from "../../db/schema";
import { CompanyDto, UserCompanyDto } from "./companies.dto";

export const mapCompanyToDto = (company: typeof companies.$inferSelect): CompanyDto => {
  return {
    id: company.id,
    name: company.name,
  };
};

type UserCompany = {
  id: number;
  name: string;
  roleName: string;
  weeklyLoadMinutes: number;
};

export const mapUserCompanyToDto = (userCompany: UserCompany): UserCompanyDto => {
  return {
    id: userCompany.id,
    name: userCompany.name,
    roleName: userCompany.roleName,
    weeklyLoadMinutes: userCompany.weeklyLoadMinutes,
  };
};
