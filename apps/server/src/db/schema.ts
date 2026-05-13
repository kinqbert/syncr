import {
  ConversationType,
  InvitationStatus,
  NotificationEntityType,
  NotificationMetadata,
  NotificationType,
  ProjectStatus,
  TaskActivityAction,
  TaskPriority,
  TaskStatus,
  UserStatus,
} from "@syncr/packages";
import { primaryKey } from "drizzle-orm/pg-core";
import { uniqueIndex } from "drizzle-orm/pg-core";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
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

// HELPERS

function enumToPgEnum<T extends Record<string, string>>(obj: T) {
  return Object.values(obj) as [T[keyof T], ...T[keyof T][]];
}

export const timestamps = {
  createdAt: timestamp({
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp({
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
};

// CORE TABLES
export const userStatusEnum = pgEnum("user_status", enumToPgEnum(UserStatus));

export const users = pgTable("users", {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(),
  surname: text().notNull(),
  password: text().notNull(),
  status: userStatusEnum().notNull().default(UserStatus.Active),
  weeklyLoadMinutes: integer()
    .notNull()
    .default(40 * 60),
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

// CALENDAR INTEGRATIONS

export const calendarProviderEnum = pgEnum("calendar_provider", ["google"]);

export const nessages = pgTable(
  "calendar_connections",
  {
    id: serial().primaryKey(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: calendarProviderEnum().notNull(),
    providerAccountEmail: text(),
    calendarId: text().notNull().default("primary"),
    accessToken: text().notNull(),
    refreshToken: text().notNull(),
    expiresAt: timestamp().notNull(),
    ...timestamps,
  },
  (table) => [unique().on(table.userId, table.provider)],
);

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
  estimateMinutes: integer(),
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
  createdAt: timestamps.createdAt,
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
  createdAt: timestamps.createdAt,
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
  userId: integer().references(() => users.id, { onDelete: "cascade" }),
  inviteeEmail: text().notNull(),
  roleId: integer()
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
});

// NOTIFICATIONS

export const notificationTypeEnum = pgEnum("notification_type", enumToPgEnum(NotificationType));
export const notificationEntityTypeEnum = pgEnum(
  "notification_entity_type",
  enumToPgEnum(NotificationEntityType),
);

export const notifications = pgTable("notifications", {
  id: serial().primaryKey(),
  recipientId: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  actorId: integer()
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  type: notificationTypeEnum().notNull(),
  entityType: notificationEntityTypeEnum().notNull(),
  entityId: integer().notNull(),
  metadata: jsonb().$type<NotificationMetadata>(),
  isRead: boolean().notNull().default(false),
  createdAt: timestamps.createdAt,
});

export const taskWatchers = pgTable("task_watchers", {
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  taskId: integer()
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
});

export const calendarTaskEvents = pgTable(
  "calendar_task_events",
  {
    id: serial().primaryKey(),
    connectionId: integer()
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    taskId: integer()
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    providerEventId: text().notNull(),
    lastSyncedAt: timestamp().notNull().defaultNow(),
  },
  (table) => [unique().on(table.connectionId, table.taskId)],
);

// CHATS

export const conversationTypeEnum = pgEnum("conversation_type", enumToPgEnum(ConversationType));

export const conversations = pgTable(
  "conversations",
  {
    id: serial().primaryKey(),
    companyId: integer()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    type: conversationTypeEnum().notNull(),
    directConversationKey: text(),
    title: text(),
    lastMessageId: integer().references((): AnyPgColumn => messages.id, { onDelete: "set null" }),
    createdById: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [uniqueIndex("direct_conversation_key_idx").on(table.directConversationKey)],
);

export const conversationParticipants = pgTable(
  "conversations_participants",
  {
    conversationId: integer()
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamps.createdAt,
    lastReadMessageId: integer().references(() => messages.id, { onDelete: "set null" }),
  },
  (table) => [
    primaryKey({
      columns: [table.conversationId, table.userId],
    }),
  ],
);

export const messages = pgTable("messages", {
  id: serial().primaryKey(),
  conversationId: integer()
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderId: integer().references(() => users.id, { onDelete: "set null" }),
  content: text().notNull(),
  createdAt: timestamps.createdAt,
  editedAt: timestamp({
    withTimezone: true,
    mode: "date",
  }),
  deletedAt: timestamp({
    withTimezone: true,
    mode: "date",
  }),
});
