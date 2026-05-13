import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  InvitationStatus,
  NotificationEntityType,
  type NotificationMetadata,
  NotificationType,
  RoleKey,
} from "@syncr/packages";
import { notifications } from "src/db/schema";
import { NotificationsGateway } from "src/modules/notifications/notifications.gateway";
import { CompaniesRepository } from "src/repositories/companies.repository";
import { InvitationsRepository } from "src/repositories/invitations.repository";
import { NotificationsRepository } from "src/repositories/notifications.repository";
import { RoleRepository } from "src/repositories/role.repository";
import { UsersRepository } from "src/repositories/users.repository";

import { mapNotificationToPayload } from "../notifications/notifications.mapper";
import { InviteTeamMembersDto } from "./invitations.dto";

const INVITABLE_ROLE_KEYS: readonly RoleKey[] = [RoleKey.ProjectManager, RoleKey.Developer];

@Injectable()
export class InvitationsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly invitationsRepository: InvitationsRepository,
    private readonly roleRepository: RoleRepository,
    private readonly companiesRepository: CompaniesRepository,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async getCompanyActiveInvitations(companyId: number) {
    return await this.invitationsRepository.getCompanyActiveInvitations(companyId);
  }

  async getPendingUserInvitations(userId: number) {
    const invitations = await this.invitationsRepository.getUserActiveInvitations(userId);

    return invitations.map(({ invitation, company, role }) => ({
      id: invitation.id,
      companyId: company.id,
      companyName: company.name,
      roleKey: role.key,
      roleName: role.name,
      status: invitation.status ?? InvitationStatus.Active,
    }));
  }

  async inviteTeamMembers(
    companyId: number,
    inviterId: number,
    inviteTeamMembersDto: InviteTeamMembersDto,
  ) {
    await this.userBelongsToTheCompany(inviterId, companyId);

    if (!INVITABLE_ROLE_KEYS.includes(inviteTeamMembersDto.roleKey)) {
      throw new BadRequestException("Users can only be invited as a manager or developer");
    }

    const emails = this.normalizeEmails(inviteTeamMembersDto.emails);

    if (emails.length === 0) {
      throw new BadRequestException("At least one invitee email is required");
    }

    const [role, company, users, companyUsers, activeInvitations] = await Promise.all([
      this.roleRepository.findRoleByKey(inviteTeamMembersDto.roleKey),
      this.companiesRepository.findCompanyById(companyId),
      this.usersRepository.findUsersByEmails(emails),
      this.usersRepository.getCompanyUsersByEmails(companyId, emails),
      this.invitationsRepository.getActiveInvitationsByEmails(companyId, emails),
    ]);

    if (!role) {
      throw new NotFoundException("Invite role not found");
    }

    if (!company) {
      throw new NotFoundException("Company not found");
    }

    const usersByEmail = new Map(users.map((user) => [user.email, user]));

    const existingMemberEmails = new Set(companyUsers.map(({ user }) => user.email));
    const activeInvitationEmails = new Set(
      activeInvitations.map((invitation) => invitation.inviteeEmail),
    );
    const duplicateEmails = emails.filter(
      (email) => existingMemberEmails.has(email) || activeInvitationEmails.has(email),
    );

    if (duplicateEmails.length > 0) {
      throw new ConflictException(
        `These emails are already members or have active invitations: ${duplicateEmails.join(", ")}`,
      );
    }

    const recipients = emails.map((email) => ({
      email,
      userId: usersByEmail.get(email)?.id as number,
    }));

    const invitations = await this.invitationsRepository.createInvitations(
      companyId,
      role.id,
      inviterId,
      recipients,
    );

    await Promise.all(
      invitations.map((invitation) =>
        this.notifyCompanyInvitation(
          invitation.userId,
          inviterId,
          invitation.id,
          company.id,
          company.name,
          role.name,
        ),
      ),
    );
  }

  async acceptInvitation(userId: number, invitationId: number) {
    return this.respondToInvitation(userId, invitationId, InvitationStatus.Accepted);
  }

  async declineInvitation(userId: number, invitationId: number) {
    return this.respondToInvitation(userId, invitationId, InvitationStatus.Declined);
  }

  private async respondToInvitation(
    userId: number,
    invitationId: number,
    status: InvitationStatus,
  ) {
    const invitation = await this.invitationsRepository.getInvitationForUser(invitationId, userId);

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    if (invitation.invitation.status !== InvitationStatus.Active) {
      throw new BadRequestException("Invitation is no longer active");
    }

    if (status === InvitationStatus.Accepted) {
      await this.invitationsRepository.acceptInvitation(invitationId, userId);
    } else {
      await this.invitationsRepository.declineInvitation(invitationId, userId);
    }

    const metadata: NotificationMetadata = {
      invitationId,
      invitationStatus: status,
      companyId: invitation.company.id,
      companyName: invitation.company.name,
      roleName: invitation.role.name,
    };
    const updatedNotification =
      await this.notificationsRepository.updateInvitationNotificationMetadata(
        userId,
        invitationId,
        metadata,
      );

    return updatedNotification ? mapNotificationToPayload(updatedNotification) : null;
  }

  private async userBelongsToTheCompany(userId: number, companyId: number) {
    const isInCompany = await this.usersRepository.isUserInCompany(userId, companyId);

    if (!isInCompany) {
      throw new UnauthorizedException("User does not belong to the company");
    }
  }

  private normalizeEmails(emails: string[]) {
    return [...new Set(emails.map((email) => email.trim().toLowerCase()).filter(Boolean))];
  }

  private async notifyCompanyInvitation(
    recipientId: number,
    actorId: number,
    invitationId: number,
    companyId: number,
    companyName: string,
    roleName: string,
  ) {
    await this.createAndSendNotification({
      recipientId,
      actorId,
      type: NotificationType.CompanyInvitation,
      entityType: NotificationEntityType.Invitation,
      entityId: invitationId,
      metadata: {
        invitationId,
        invitationStatus: InvitationStatus.Active,
        companyId,
        companyName,
        roleName,
      },
    });
  }

  private async createAndSendNotification(values: typeof notifications.$inferInsert) {
    const notification = await this.notificationsRepository.addNotification(values);

    this.notificationsGateway.sendNotification(
      notification.recipientId,
      mapNotificationToPayload(notification),
    );
  }
}
