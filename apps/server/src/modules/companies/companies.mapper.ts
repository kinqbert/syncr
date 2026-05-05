import { companies } from "src/db/schema";

import { CompanyDto } from "./companies.dto";

export const mapCompanyToDto = (company: typeof companies.$inferSelect): CompanyDto => {
  return {
    id: company.id,
    name: company.name,
  };
};
