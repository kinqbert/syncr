import { Injectable, UnauthorizedException } from "@nestjs/common";
import type {
  DashboardBirthday,
  DashboardChartPoint,
  DashboardData,
} from "@syncr/packages";
import { DashboardRepository } from "src/repositories/dashboard.repository";
import { UsersRepository } from "src/repositories/users.repository";

@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardRepository: DashboardRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getDashboard(companyId: number, userId: number): Promise<DashboardData> {
    await this.userBelongsToCompany(userId, companyId);

    const [summary, completedByDay, upcomingBirthdays, recentActivity] =
      await Promise.all([
        this.dashboardRepository.getSummary(companyId, userId),
        this.dashboardRepository.getTasksCompletedThisWeek(companyId),
        this.dashboardRepository.getUpcomingBirthdays(companyId),
        this.dashboardRepository.getRecentActivity(companyId),
      ]);

    return {
      summary: {
        activeProjects: summary.activeProjects,
        tasksCompleted: summary.tasksCompleted,
        tasksDueToday: summary.tasksDueToday,
        teamMembers: summary.teamMembers,
        myAssignedTasks: summary.myAssignedTasks,
        unreadNotifications: summary.unreadNotifications,
      },
      tasksCompletedThisWeek: this.mapCompletedWeek(completedByDay),
      upcomingBirthdays: this.mapUpcomingBirthdays(upcomingBirthdays),
      recentActivity: recentActivity.map((activity) => ({
        id: activity.id,
        action: activity.action,
        actor:
          activity.actor?.id != null &&
          activity.actor.name != null &&
          activity.actor.surname != null
            ? {
                id: activity.actor.id,
                name: activity.actor.name,
                surname: activity.actor.surname,
              }
            : null,
        task: activity.task,
        createdAt: activity.createdAt.toISOString(),
      })),
    };
  }

  private mapCompletedWeek(
    rows: { day: string; value: number }[],
  ): DashboardChartPoint[] {
    const valueByDay = new Map(rows.map((row) => [row.day, row.value]));
    const startOfWeek = new Date();
    const daysSinceMonday = (startOfWeek.getDay() + 6) % 7;

    startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
      (label, index) => {
        const day = new Date(startOfWeek);

        day.setDate(startOfWeek.getDate() + index);

        const key = day.toISOString().slice(0, 10);

        return {
          label,
          value: valueByDay.get(key) ?? 0,
        };
      },
    );
  }

  private mapUpcomingBirthdays(
    birthdays: {
      userId: number;
      name: string;
      surname: string;
      birthday: string | null;
    }[],
  ): DashboardBirthday[] {
    return birthdays
      .flatMap((birthday) =>
        birthday.birthday
          ? [
              {
                userId: birthday.userId,
                name: birthday.name,
                surname: birthday.surname,
                birthday: birthday.birthday,
                daysRemaining: this.getDaysUntilBirthday(birthday.birthday),
              },
            ]
          : [],
      )
      .sort((first, second) => {
        if (first.daysRemaining !== second.daysRemaining) {
          return first.daysRemaining - second.daysRemaining;
        }

        return `${first.name} ${first.surname}`.localeCompare(
          `${second.name} ${second.surname}`,
        );
      });
  }

  private getDaysUntilBirthday(birthday: string) {
    const [, month, day] = birthday.split("-").map(Number);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let nextBirthday = new Date(today.getFullYear(), month - 1, day);

    if (nextBirthday.getTime() < today.getTime()) {
      nextBirthday = new Date(today.getFullYear() + 1, month - 1, day);
    }

    const dayMs = 24 * 60 * 60 * 1000;

    return Math.round((nextBirthday.getTime() - today.getTime()) / dayMs);
  }

  private async userBelongsToCompany(userId: number, companyId: number) {
    const isUserInCompany = await this.usersRepository.isUserInCompany(
      userId,
      companyId,
    );

    if (!isUserInCompany) {
      throw new UnauthorizedException("User does not belong to the company");
    }
  }
}
