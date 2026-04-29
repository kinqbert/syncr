export const RoleKey = {
  Owner: "owner",
  ProjectManager: "project_manager",
  Developer: "developer",
} as const;

export type RoleKey = (typeof RoleKey)[keyof typeof RoleKey];

export const PermissionKey = {
  CompanyManage: "company:manage",
  UserInvite: "user:invite",
  UserRemove: "user:remove",

  ProjectCreate: "project:create",
  ProjectUpdate: "project:update",
  ProjectDelete: "project:delete",
  ProjectView: "project:view",

  TaskCreate: "task:create",
  TaskUpdate: "task:update",
  TaskDelete: "task:delete",
  TaskAssign: "task:assign",
  TaskUpdateStatus: "task:update_status",
  TaskView: "task:view",

  CommentCreate: "comment:create",
  CommentView: "comment:view",

  AnalyticsView: "analytics:view",
};

export type PermissionKey = (typeof PermissionKey)[keyof typeof PermissionKey];
