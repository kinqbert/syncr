import { Logger } from "@nestjs/common";
import { PermissionKey, RoleKey } from "@syncr/packages";

import db from "../db/drizzle";
import { permissions, rolePermissions, roles } from "../db/schema";

// CONSTANTS

const INITIAL_ROLE_RECORDS: Record<RoleKey, typeof roles.$inferInsert> = {
  [RoleKey.Owner]: {
    key: RoleKey.Owner,
    name: "Company Owner",
  },

  [RoleKey.ProjectManager]: {
    key: RoleKey.ProjectManager,
    name: "Project Manager",
  },

  [RoleKey.Developer]: {
    key: RoleKey.Developer,
    name: "Developer",
  },
};

const INITIAL_PERMISSION_RECORDS: Record<PermissionKey, typeof permissions.$inferInsert> = {
  [PermissionKey.CompanyManage]: { key: PermissionKey.CompanyManage, name: "Manage company" },
  [PermissionKey.UserInvite]: { key: PermissionKey.UserInvite, name: "Invite users" },
  [PermissionKey.UserRemove]: { key: PermissionKey.UserRemove, name: "Remove users" },
  [PermissionKey.TeamView]: { key: PermissionKey.TeamView, name: "View team" },
  [PermissionKey.ProjectCreate]: { key: PermissionKey.ProjectCreate, name: "Create projects" },
  [PermissionKey.ProjectUpdate]: { key: PermissionKey.ProjectUpdate, name: "Update projects" },
  [PermissionKey.ProjectDelete]: { key: PermissionKey.ProjectDelete, name: "Delete projects" },
  [PermissionKey.ProjectView]: { key: PermissionKey.ProjectView, name: "View projects" },
  [PermissionKey.TaskCreate]: { key: PermissionKey.TaskCreate, name: "Create tasks" },
  [PermissionKey.TaskUpdate]: { key: PermissionKey.TaskUpdate, name: "Update tasks" },
  [PermissionKey.TaskDelete]: { key: PermissionKey.TaskDelete, name: "Delete tasks" },
  [PermissionKey.TaskAssign]: { key: PermissionKey.TaskAssign, name: "Assign tasks" },
  [PermissionKey.TaskUpdateStatus]: {
    key: PermissionKey.TaskUpdateStatus,
    name: "Update task status",
  },
  [PermissionKey.TaskView]: { key: PermissionKey.TaskView, name: "View tasks" },
  [PermissionKey.CommentCreate]: { key: PermissionKey.CommentCreate, name: "Create comments" },
  [PermissionKey.CommentView]: { key: PermissionKey.CommentView, name: "View comments" },
  [PermissionKey.AnalyticsView]: { key: PermissionKey.AnalyticsView, name: "View analytics" },
};

const ROLE_PERMISSION_RECORDS: Record<RoleKey, PermissionKey[]> = {
  [RoleKey.Owner]: Object.values(PermissionKey),

  [RoleKey.ProjectManager]: [
    PermissionKey.UserInvite,
    PermissionKey.ProjectCreate,
    PermissionKey.ProjectUpdate,
    PermissionKey.ProjectDelete,
    PermissionKey.ProjectView,
    PermissionKey.TeamView,
    PermissionKey.TaskCreate,
    PermissionKey.TaskUpdate,
    PermissionKey.TaskDelete,
    PermissionKey.TaskAssign,
    PermissionKey.TaskUpdateStatus,
    PermissionKey.TaskView,
    PermissionKey.CommentCreate,
    PermissionKey.CommentView,
    PermissionKey.AnalyticsView,
  ],

  [RoleKey.Developer]: [
    PermissionKey.ProjectView,
    PermissionKey.TaskCreate,
    PermissionKey.TaskUpdate,
    PermissionKey.TaskUpdateStatus,
    PermissionKey.TaskView,
    PermissionKey.CommentCreate,
    PermissionKey.CommentView,
  ],
};

// HELPERS

const initialRoles: (typeof roles.$inferInsert)[] = Object.values(INITIAL_ROLE_RECORDS);

const initialPermissions: (typeof permissions.$inferInsert)[] = Object.values(
  INITIAL_PERMISSION_RECORDS,
);

const keyIdMap = <T extends { key: string; id: number }>(rows: T[]) => {
  return new Map(rows.map((row) => [row.key, row.id]));
};

const getInitialRolePermissions = (
  dbRoles: (typeof roles.$inferSelect)[],
  dbPermissions: (typeof permissions.$inferSelect)[],
): (typeof rolePermissions.$inferInsert)[] => {
  const result: (typeof rolePermissions.$inferInsert)[] = [];

  const dbRolesIdsMap = keyIdMap(dbRoles);

  const dbPermissionsIdsMap = keyIdMap(dbPermissions);

  for (const [role, permissions] of Object.entries(ROLE_PERMISSION_RECORDS)) {
    for (const permission of permissions) {
      const roleId = dbRolesIdsMap.get(role);

      const permissionId = dbPermissionsIdsMap.get(permission);

      if (!roleId || !permissionId) {
        Logger.error(`Error pushing role with role ${role} and permission ${permission}`);

        continue;
      }

      result.push({ roleId, permissionId });
    }
  }

  return result;
};

// SEEDERS

const seedRoles = async () => {
  await db.insert(roles).values(initialRoles).onConflictDoNothing();
  await db.insert(permissions).values(initialPermissions).onConflictDoNothing();

  const dbRoles = await db.select().from(roles);
  const dbPermissions = await db.select().from(permissions);
  const rolePermissionsInserts = getInitialRolePermissions(dbRoles, dbPermissions);

  await db.insert(rolePermissions).values(rolePermissionsInserts).onConflictDoNothing();
};

export const seedDb = async () => {
  try {
    await seedRoles();

    Logger.log("Roles seeded!");
  } catch (error) {
    Logger.error("Error happened during roles seeding:", error);
  }
};
