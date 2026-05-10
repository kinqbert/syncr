import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { NotificationPayload, PermissionKey, type UserInvitation } from "@syncr/packages";
import { CompanyId } from "src/common/decorators/company-id.decorator";
import { RequirePermission } from "src/common/decorators/require-permission.decorator";
import { UserId } from "src/common/decorators/user-id.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PermissionGuard } from "src/common/guards/permission-guard.guard";

import { InviteTeamMembersDto } from "./invitations.dto";
import { InvitationsService } from "./invitations.service";

@Controller("invitations")
@UseGuards(JwtAuthGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get("pending")
  @HttpCode(HttpStatus.OK)
  async getPendingInvitations(@UserId() userId: number): Promise<UserInvitation[]> {
    return await this.invitationsService.getPendingUserInvitations(userId);
  }

  @Post()
  @RequirePermission(PermissionKey.UserInvite)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  async inviteTeamMembers(
    @CompanyId() companyId: number,
    @UserId() userId: number,
    @Body() inviteTeamMembersDto: InviteTeamMembersDto,
  ) {
    await this.invitationsService.inviteTeamMembers(companyId, userId, inviteTeamMembersDto);
  }

  @Patch(":invitationId/accept")
  @HttpCode(HttpStatus.OK)
  async acceptInvitation(
    @UserId() userId: number,
    @Param("invitationId", ParseIntPipe) invitationId: number,
  ): Promise<NotificationPayload | null> {
    return await this.invitationsService.acceptInvitation(userId, invitationId);
  }

  @Patch(":invitationId/decline")
  @HttpCode(HttpStatus.OK)
  async declineInvitation(
    @UserId() userId: number,
    @Param("invitationId", ParseIntPipe) invitationId: number,
  ): Promise<NotificationPayload | null> {
    return await this.invitationsService.declineInvitation(userId, invitationId);
  }
}
