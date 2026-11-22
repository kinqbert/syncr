import { Injectable } from "@nestjs/common";
import type { DashboardBirthday, DashboardData, DashboardTaskStatusPoint } from "@syncr/packages";
import { TaskStatus } from "@syncr/packages";
import type { ProjectViewer } from "src/common/decorators/project-viewer.decorator";
import { DashboardRepository } from "src/repositories/dashboard.repository";

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getDashboard(companyId: number, viewer: ProjectViewer): Promise<DashboardData> {
    const [summary, tasksByStatus, upcomingBirthdays, recentActivity] = await Promise.all([
      this.dashboardRepository.getSummary(companyId, viewer),
      this.dashboardRepository.getTasksByStatus(companyId, viewer),
      this.dashboardRepository.getUpcomingBirthdays(companyId),
      this.dashboardRepository.getRecentActivity(companyId, viewer),
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
      tasksByStatus: this.mapTasksByStatus(tasksByStatus),
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
        project: activity.project,
        createdAt: activity.createdAt.toISOString(),
      })),
    };
  }

  private mapTasksByStatus(
    rows: { status: TaskStatus; value: number }[],
  ): DashboardTaskStatusPoint[] {
    const valueByStatus = new Map(rows.map((row) => [row.status, row.value]));

    return [
      TaskStatus.Backlog,
      TaskStatus.Todo,
      TaskStatus.InProgress,
      TaskStatus.Review,
      TaskStatus.Done,
    ].map((status) => ({
      status,
      value: valueByStatus.get(status) ?? 0,
    }));
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

        return `${first.name} ${first.surname}`.localeCompare(`${second.name} ${second.surname}`);
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
}
