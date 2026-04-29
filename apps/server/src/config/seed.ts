import { Logger } from "@nestjs/common";
import { PermissionKey, RoleKey } from "@syncr/packages";
import db from "src/db/drizzle";
import { permissions, rolePermissions, roles } from "src/db/schema";

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
    PermissionKey.ProjectCreate,
    PermissionKey.ProjectUpdate,
    PermissionKey.ProjectDelete,
    PermissionKey.ProjectView,

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

const initialRoles: (typeof roles.$inferInsert)[] = Object.values(INITIAL_ROLE_RECORDS);
const initialPermissions: (typeof permissions.$inferInsert)[] = Object.values(
  INITIAL_PERMISSION_RECORDS,
);

const getInitialRolePermissions = (
  dbRoles: (typeof roles.$inferSelect)[],
  dbPermissions: (typeof permissions.$inferSelect)[],
): (typeof rolePermissions.$inferInsert)[] => {
  const result: (typeof rolePermissions.$inferInsert)[] = [];

  const dbRolesIdsMap: Map<RoleKey, number> = new Map();
  const dbPermissionsIdsMap: Map<PermissionKey, number> = new Map();

  for (const role of dbRoles) {
    dbRolesIdsMap.set(role.key as RoleKey, role.id);
  }

  for (const permission of dbPermissions) {
    dbPermissionsIdsMap.set(permission.key, permission.id);
  }

  for (const role of Object.keys(ROLE_PERMISSION_RECORDS)) {
    for (const permission of ROLE_PERMISSION_RECORDS[role]) {
      const roleId = dbRolesIdsMap.get(role as RoleKey);
      const permissionId = dbPermissionsIdsMap.get(permission as PermissionKey);

      if (!roleId || !permissionId) {
        Logger.error(`Error pushing role with role ${role} and permission ${permission}`);
        continue;
      }

      result.push({ roleId, permissionId });
    }
  }

  return result;
};

const seedRoles = async () => {
  try {
    const dbRoles = await db.insert(roles).values(initialRoles).onConflictDoNothing().returning();
    const dbPermissions = await db
      .insert(permissions)
      .values(initialPermissions)
      .onConflictDoNothing()
      .returning();

    const rolePermissionsInserts = getInitialRolePermissions(dbRoles, dbPermissions);

    await db
      .insert(rolePermissions)
      .values(rolePermissionsInserts)
      .onConflictDoNothing()
      .returning();
  } catch (error) {
    Logger.error("Error happened during roles seeding:", error);
  }
};
