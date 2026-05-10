import { Module } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { NotificationsModule } from "src/modules/notifications/notifications.module";
import { AuthRepository } from "src/repositories/auth.repository";
import { CompaniesRepository } from "src/repositories/companies.repository";
import { InvitationsRepository } from "src/repositories/invitations.repository";
import { NotificationsRepository } from "src/repositories/notifications.repository";
import { RoleRepository } from "src/repositories/role.repository";
import { UsersRepository } from "src/repositories/users.repository";

import { InvitationsController } from "./invitations.controller";
import { InvitationsService } from "./invitations.service";

@Module({
  imports: [NotificationsModule],
  controllers: [InvitationsController],
  providers: [
    InvitationsService,
    JwtAuthGuard,
    AuthRepository,
    CompaniesRepository,
    InvitationsRepository,
    NotificationsRepository,
    RoleRepository,
    UsersRepository,
  ],
  exports: [InvitationsService],
})
export class InvitationsModule {}
