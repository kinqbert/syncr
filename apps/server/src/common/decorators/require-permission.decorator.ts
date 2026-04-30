import { SetMetadata } from "@nestjs/common";
import { PermissionKey } from "@syncr/packages";

export const REQUIRED_PERMISSION_KEY = "required_permission";

export const RequirePermission = (permission: PermissionKey) =>
  SetMetadata(REQUIRED_PERMISSION_KEY, permission);
