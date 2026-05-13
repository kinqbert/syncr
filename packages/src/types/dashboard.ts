import type { TaskActivityAction } from "./tasks";

export type DashboardSummary = {
  activeProjects: number;
  tasksCompleted: number;
  tasksCompletedChangePercent: number | null;
  tasksDueToday: number;
  teamMembers: number;
};

export type DashboardChartPoint = {
  label: string;
  value: number;
};

export type DashboardActivity = {
  id: number;
  action: TaskActivityAction;
  actor: {
    id: number;
    name: string;
    surname: string;
  } | null;
  task: {
    id: number;
    name: string;
  };
  createdAt: string;
};

export type DashboardData = {
  summary: DashboardSummary;
  tasksCompletedThisWeek: DashboardChartPoint[];
  recentActivity: DashboardActivity[];
};
