import { Injectable } from "@nestjs/common";
import { InvitationStatus } from "@syncr/packages";
import { and, eq, inArray, or } from "drizzle-orm";

import { DbProvider } from "../db/db.provider";
import { companies, invitations, roles, userCompanyRoles, users } from "../db/schema";
import { BaseRepository } from "./base.repository";

type InvitationRecipient = {
  userId: number | null;
  email: string;
};

@Injectable()
export class InvitationsRepository extends BaseRepository {
  constructor(dbProvider: DbProvider) {
    super(dbProvider);
  }

  async getCompanyActiveInvitations(companyId: number) {
    return this.db
      .select({
        invitation: invitations,
        role: roles,
      })
      .from(invitations)
      .innerJoin(roles, eq(roles.id, invitations.roleId))
      .where(
        and(eq(invitations.companyId, companyId), eq(invitations.status, InvitationStatus.Active)),
      );
  }

  async getActiveInvitationsByEmails(companyId: number, emails: string[]) {
    if (emails.length === 0) {
      return [];
    }

    return this.db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.companyId, companyId),
          eq(invitations.status, InvitationStatus.Active),
          inArray(invitations.inviteeEmail, emails),
        ),
      );
  }

  async getUserActiveInvitations(userId: number) {
    return this.db
      .select({
        invitation: invitations,
        role: roles,
        company: companies,
      })
      .from(invitations)
      .innerJoin(roles, eq(roles.id, invitations.roleId))
      .innerJoin(companies, eq(companies.id, invitations.companyId))
      .innerJoin(users, eq(users.id, userId))
      .where(
        and(
          or(eq(invitations.userId, userId), eq(invitations.inviteeEmail, users.email)),
          eq(invitations.status, InvitationStatus.Active),
        ),
      );
  }

  async createInvitations(companyId: number, roleId: number, recipients: InvitationRecipient[]) {
    if (recipients.length === 0) {
      return [];
    }

    return this.db
      .insert(invitations)
      .values(
        recipients.map((recipient) => ({
          companyId,
          userId: recipient.userId,
          inviteeEmail: recipient.email,
          roleId,
          status: InvitationStatus.Active,
        })),
      )
      .returning();
  }

  async getInvitationForUser(invitationId: number, userId: number) {
    const [invitation] = await this.db
      .select({
        invitation: invitations,
        role: roles,
        company: companies,
      })
      .from(invitations)
      .innerJoin(roles, eq(roles.id, invitations.roleId))
      .innerJoin(companies, eq(companies.id, invitations.companyId))
      .innerJoin(users, eq(users.id, userId))
      .where(
        and(
          eq(invitations.id, invitationId),
          or(eq(invitations.userId, userId), eq(invitations.inviteeEmail, users.email)),
        ),
      )
      .limit(1);

    return invitation;
  }

  async acceptInvitation(invitationId: number, userId: number) {
    return this.db.transaction(async (tx) => {
      const [invitation] = await tx
        .select()
        .from(invitations)
        .innerJoin(users, eq(users.id, userId))
        .where(
          and(
            eq(invitations.id, invitationId),
            or(eq(invitations.userId, userId), eq(invitations.inviteeEmail, users.email)),
          ),
        )
        .limit(1);

      if (!invitation) {
        return undefined;
      }

      if (invitation.invitations.status !== InvitationStatus.Active) {
        return invitation.invitations;
      }

      await tx
        .insert(userCompanyRoles)
        .values({
          userId,
          companyId: invitation.invitations.companyId,
          roleId: invitation.invitations.roleId,
        })
        .onConflictDoNothing();

      const [updatedInvitation] = await tx
        .update(invitations)
        .set({ status: InvitationStatus.Accepted, userId })
        .where(eq(invitations.id, invitationId))
        .returning();

      return updatedInvitation;
    });
  }

  async declineInvitation(invitationId: number, userId: number) {
    return this.db.transaction(async (tx) => {
      const [invitation] = await tx
        .select()
        .from(invitations)
        .innerJoin(users, eq(users.id, userId))
        .where(
          and(
            eq(invitations.id, invitationId),
            or(eq(invitations.userId, userId), eq(invitations.inviteeEmail, users.email)),
          ),
        )
        .limit(1);

      if (!invitation) {
        return undefined;
      }

      if (invitation.invitations.status !== InvitationStatus.Active) {
        return invitation.invitations;
      }

      const [updatedInvitation] = await tx
        .update(invitations)
        .set({ status: InvitationStatus.Declined, userId })
        .where(eq(invitations.id, invitationId))
        .returning();

      return updatedInvitation;
    });
  }
}
