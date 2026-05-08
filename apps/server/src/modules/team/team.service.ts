import { Injectable, UnauthorizedException } from "@nestjs/common";
import { TasksRepository } from "src/repositories/tasks.repository";
import { UsersRepository } from "src/repositories/users.repository";

import { mapToTeamDataResponseDto } from "./team.mapper";

@Injectable()
export class TeamService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async getCompanyTeamData(companyId: number, userId: number) {
    await this.userBelongsToTheCompany(userId, companyId);

    const usersData = await this.usersRepository.getCompanyTeamUserData(companyId);
    const tasksData = await this.tasksRepository.getCompanyTeamTasksData(companyId);

    return mapToTeamDataResponseDto(usersData, tasksData);
  }

  private async userBelongsToTheCompany(userId: number, companyId: number) {
    const isInCompany = await this.usersRepository.isUserInCompany(userId, companyId);

    if (!isInCompany) {
      throw new UnauthorizedException("User does not belong to the company");
    }
  }
}
