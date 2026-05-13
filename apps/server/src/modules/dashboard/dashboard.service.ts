import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { DashboardChartPoint, DashboardData } from "@syncr/packages";
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

    const [summary, completedByDay, recentActivity] =
      await Promise.all([
        this.dashboardRepository.getSummary(companyId),
        this.dashboardRepository.getTasksCompletedThisWeek(companyId),
        this.dashboardRepository.getRecentActivity(companyId),
      ]);

    return {
      summary: {
        activeProjects: summary.activeProjects,
        tasksCompleted: summary.tasksCompleted,
        tasksCompletedChangePercent: this.getChangePercent(
          summary.tasksCompletedThisWeek,
          summary.tasksCompletedPreviousWeek,
        ),
        tasksDueToday: summary.tasksDueToday,
        teamMembers: summary.teamMembers,
      },
      tasksCompletedThisWeek: this.mapCompletedWeek(completedByDay),
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

  private getChangePercent(current: number, previous: number) {
    if (previous === 0) {
      return current === 0 ? 0 : null;
    }

    return Math.round(((current - previous) / previous) * 100);
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
