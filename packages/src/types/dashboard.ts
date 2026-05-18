import type { TaskActivityAction, TaskStatus } from "./tasks";

export type DashboardSummary = {
  activeProjects: number;
  tasksCompleted: number;
  tasksDueToday: number;
  teamMembers: number;
  myAssignedTasks: number;
  unreadNotifications: number;
};

export type DashboardTaskStatusPoint = {
  status: TaskStatus;
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

export type DashboardBirthday = {
  userId: number;
  name: string;
  surname: string;
  birthday: string;
  daysRemaining: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  tasksByStatus: DashboardTaskStatusPoint[];
  upcomingBirthdays: DashboardBirthday[];
  recentActivity: DashboardActivity[];
};
