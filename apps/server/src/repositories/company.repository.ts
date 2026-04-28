import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import db from "src/db/drizzle";
import { companies, userCompanyRoles } from "src/db/schema";

@Injectable()
export class CompanyRepository {
  async getUserCompanies(userId: number) {
    const userCompanies = await db
      .select()
      .from(userCompanyRoles)
      .where(eq(userCompanyRoles.userId, userId))
      .innerJoin(companies, eq(userCompanyRoles.companyId, companies.id));

    return userCompanies.map((company) => company.companies);
  }
}
