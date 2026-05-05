import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import db from "src/db/drizzle";
import { companies, roles, userCompanyRoles } from "src/db/schema";

const OWNER_ROLE = {
  key: "owner",
  name: "Owner",
};

@Injectable()
export class CompaniesRepository {
  async getUserCompanies(userId: number) {
    const userCompanies = await db
      .select()
      .from(userCompanyRoles)
      .where(eq(userCompanyRoles.userId, userId))
      .innerJoin(companies, eq(userCompanyRoles.companyId, companies.id));

    return userCompanies.map((company) => company.companies);
  }

  async createUserCompany(userId: number, name: string) {
    return await db.transaction(async (tx) => {
      const [company] = await tx.insert(companies).values({ name }).returning();

      const ownerRole = await this.findOrCreateOwnerRole(tx);

      await tx.insert(userCompanyRoles).values({
        userId,
        companyId: company.id,
        roleId: ownerRole.id,
      });

      return company;
    });
  }

  private async findOrCreateOwnerRole(tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) {
    const [createdRole] = await tx
      .insert(roles)
      .values(OWNER_ROLE)
      .onConflictDoNothing()
      .returning();

    if (createdRole) {
      return createdRole;
    }

    const [existingRole] = await tx.select().from(roles).where(eq(roles.key, OWNER_ROLE.key));

    return existingRole;
  }
}
