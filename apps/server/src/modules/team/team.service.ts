import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InvitationsService } from "src/modules/invitations/invitations.service";
import { TasksRepository } from "src/repositories/tasks.repository";
import { UsersRepository } from "src/repositories/users.repository";

import { mapToTeamDataResponseDto } from "./team.mapper";

@Injectable()
export class TeamService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tasksRepository: TasksRepository,
    private readonly invitationsService: InvitationsService,
  ) {}

  async getCompanyTeamData(companyId: number, userId: number) {
    await this.userBelongsToTheCompany(userId, companyId);

    const usersData = await this.usersRepository.getCompanyTeamUserData(companyId);
    const tasksData = await this.tasksRepository.getCompanyTeamTasksData(companyId);
    const invitationsData = await this.invitationsService.getCompanyActiveInvitations(companyId);

    return mapToTeamDataResponseDto(usersData, tasksData, invitationsData);
  }

  private async userBelongsToTheCompany(userId: number, companyId: number) {
    const isInCompany = await this.usersRepository.isUserInCompany(userId, companyId);

    if (!isInCompany) {
      throw new UnauthorizedException("User does not belong to the company");
    }
  }
}
