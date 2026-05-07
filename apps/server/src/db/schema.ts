import {
  InvitationStatus,
  ProjectStatus,
  TaskActivityAction,
  TaskPriority,
  TaskStatus,
} from "@syncr/packages";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// CORE TABLES
export const users = pgTable("users", {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(),
  surname: text().notNull(),
  password: text().notNull(),
});

export const companies = pgTable("companies", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
});

export const userSessions = pgTable("user_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  refreshTokenHash: text().notNull(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp().notNull(),
});

// ROLES
export const roles = pgTable("roles", {
  id: serial().primaryKey(),
  key: text().notNull().unique(),
  name: text().notNull().unique(),
});

export const permissions = pgTable("permissions", {
  id: serial().primaryKey(),
  key: text().notNull().unique(),
  name: text().notNull(),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: integer()
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: integer()
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.roleId, table.permissionId)],
);

export const userCompanyRoles = pgTable(
  "user_company_roles",
  {
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyId: integer()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    roleId: integer()
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.userId, table.companyId)],
);

// PROJECTS

export const projectStatusEnum = pgEnum("project_status", enumToPgEnum(ProjectStatus));

export const projects = pgTable("projects", {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  managerId: integer().references(() => users.id, { onDelete: "set null" }),
  companyId: integer()
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  status: projectStatusEnum().notNull().default("active"),
  startDate: timestamp().notNull(),
  endDate: timestamp(),
});

export const projectUsers = pgTable("project_users", {
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: integer()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
});

export const projectLabels = pgTable(
  "project_labels",
  {
    id: serial().primaryKey(),
    projectId: integer()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text().notNull(),
  },
  (table) => [unique().on(table.projectId, table.name)],
);

// TASKS

export const taskStatusEnum = pgEnum("task_status", enumToPgEnum(TaskStatus));
export const taskPriorityEnum = pgEnum("task_priority", enumToPgEnum(TaskPriority));
export const taskActivityActionEnum = pgEnum(
  "task_activity_action",
  enumToPgEnum(TaskActivityAction),
);

export const tasks = pgTable("tasks", {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  projectId: integer()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  assigneeId: integer().references(() => users.id, { onDelete: "set null" }),
  status: taskStatusEnum().notNull().default(TaskStatus.Backlog),
  priority: taskPriorityEnum().notNull().default(TaskPriority.Medium),
  position: integer().notNull().default(0),
  endDate: timestamp(),
});

export const taskAcceptanceCriteria = pgTable("task_acceptance_criteria", {
  id: serial().primaryKey(),
  taskId: integer()
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  description: text().notNull(),
  isDone: boolean().notNull().default(false),
  position: integer().notNull().default(0),
});

export const taskComments = pgTable("task_comments", {
  id: serial().primaryKey(),
  taskId: integer()
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: integer().references(() => users.id, { onDelete: "set null" }),
  content: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const taskActivities = pgTable("task_activities", {
  id: serial().primaryKey(),
  taskId: integer()
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: integer().references(() => users.id, { onDelete: "set null" }),
  action: taskActivityActionEnum().notNull(),
  previousValue: text(),
  newValue: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const taskLabels = pgTable(
  "task_labels",
  {
    taskId: integer()
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    labelId: integer()
      .notNull()
      .references(() => projectLabels.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.taskId, table.labelId)],
);

// INVITATIONS

export const invitationStatusEnum = pgEnum("invitation_status", enumToPgEnum(InvitationStatus));

export const invitations = pgTable("invitations", {
  id: serial().primaryKey(),
  status: invitationStatusEnum().default(InvitationStatus.Active),
  companyId: integer()
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inviteeEmail: text().notNull(),
  roleId: integer()
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
});

// HELPERS

function enumToPgEnum<T extends Record<string, string>>(obj: T) {
  return Object.values(obj) as [T[keyof T], ...T[keyof T][]];
}
