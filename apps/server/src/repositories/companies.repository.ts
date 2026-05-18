import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import { companies, roles, userCompanyRoles } from "../db/schema";
import { BaseRepository } from "./base.repository";

const OWNER_ROLE = {
  key: "owner",
  name: "Owner",
};

@Injectable()
export class CompaniesRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async getUserCompanies(userId: number) {
    const userCompanies = await this.db
      .select({
        id: companies.id,
        name: companies.name,
        roleName: roles.name,
        weeklyLoadMinutes: userCompanyRoles.weeklyLoadMinutes,
      })
      .from(userCompanyRoles)
      .where(eq(userCompanyRoles.userId, userId))
      .innerJoin(companies, eq(userCompanyRoles.companyId, companies.id))
      .innerJoin(roles, eq(userCompanyRoles.roleId, roles.id));

    return userCompanies;
  }

  async findCompanyById(companyId: number) {
    const [company] = await this.db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    return company;
  }

  async updateUserCompanySettings(
    userId: number,
    companyId: number,
    data: Pick<typeof userCompanyRoles.$inferInsert, "weeklyLoadMinutes">,
  ) {
    const [settings] = await this.db
      .update(userCompanyRoles)
      .set(data)
      .where(and(eq(userCompanyRoles.userId, userId), eq(userCompanyRoles.companyId, companyId)))
      .returning();

    return settings;
  }

  async createUserCompany(userId: number, name: string) {
    return await this.db.transaction(async (tx) => {
      const [company] = await tx.insert(companies).values({ name }).returning();

      const [createdOwnerRole] = await tx
        .insert(roles)
        .values(OWNER_ROLE)
        .onConflictDoNothing()
        .returning();

      const [existingOwnerRole] = createdOwnerRole
        ? []
        : await tx.select().from(roles).where(eq(roles.key, OWNER_ROLE.key)).limit(1);

      const ownerRole = createdOwnerRole ?? existingOwnerRole;

      if (!ownerRole) {
        throw new Error("Owner role is not configured");
      }

      await tx.insert(userCompanyRoles).values({
        userId,
        companyId: company.id,
        roleId: ownerRole.id,
      });

      return company;
    });
  }
}
